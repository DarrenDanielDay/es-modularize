import * as path from "./path.js";
import { rawRecursive } from "taio/esm/libs/custom/algorithms/recursive.mjs";
import {
  definitelyTypedLibPrefix,
  INDEX,
  jsExt,
  jsonExt,
  latest,
  mjsExt,
  MODULE,
  PACKAGE_JSON,
  selfReference,
  slash,
} from "./constants.js";
import {
  type FS,
  type PackageHost,
  type ScriptURL,
  ESModuleFileType,
  resolvePackageByName,
  type PackageJSON,
  type ExportReference,
  type PackageMeta,
  type PendingPackageMeta,
  type ESModuleFile,
  type PackageMetaWithExports,
  accessExport,
  type PackageSpec,
  type ExportAddOn,
  type DependencyAddOn,
  type ExportMapping,
  type StaticExportMapping,
  packageId,
  detectFormat,
  detectDefaultFormat,
} from "./core.js";
import { notFound, notSupported } from "./errors.js";
import type { PackageRegistry } from "./registry.js";
import { isRelative, toRelative, trimSlash, warn } from "./utils.js";
import { inject } from "func-di";
import { $fs, $host, $registry } from "./deps.js";
const exportReferenceNotSupported = (ref: ExportReference) =>
  notSupported(`Cannot find export subpath: ${JSON.stringify(ref)}`);

/**
 * Detect if the export subpath is pointing to a file in esm format by the subpath itself.
 * @param subpath export subpath
 * @param pjson package.json
 */
const detectIfESM = (subpath: string, pjson: PackageJSON) => {
  if (detectFormat(pjson, path.parse(subpath).ext) === ESModuleFileType.Module) {
    return true;
  }
  if (subpath.split(slash).some((fragment) => fragment.includes("esm") || fragment === "es")) {
    return true;
  }
  return false;
};

const getRefSubpath = (
  ref: ExportReference,
  pjson: PackageJSON
): [subpath: string, format: ESModuleFileType | null] => {
  if (typeof ref === "string") {
    const { ext } = path.parse(ref);
    return [ref, detectFormat(pjson, ext)];
  }
  if (Array.isArray(ref)) {
    for (const r of ref) {
      return getRefSubpath(r, pjson);
    }
    return exportReferenceNotSupported(ref);
  }
  const { browser, worker, import: _import, require, default: _default, module, commonjs } = ref;
  const esm = browser ?? worker ?? module ?? _import ?? (_default && detectIfESM(_default, pjson) && _default);
  if (esm) {
    return [esm, ESModuleFileType.Module];
  }
  const cjs = require ?? commonjs;
  if (cjs) {
    return [cjs, ESModuleFileType.Script];
  }
  return [_default ?? exportReferenceNotSupported(ref), null];
};
export const PackageHostImpl = inject({ fs: $fs, registry: $registry }).implements($host, (ctx) =>
  createPackageHost(ctx.fs, ctx.registry)
);
const createPackageHost = (fs: FS, registry: PackageRegistry): PackageHost => {
  const resolveAsFile = (url: ScriptURL): ESModuleFile | null => {
    const isModule = url.packageMeta.packageJSON.type === MODULE;
    const targetSuffixes: [string, ESModuleFileType][] = [
      ["", url.format ?? ESModuleFileType.Script],
      [".js", isModule ? ESModuleFileType.Module : ESModuleFileType.Script],
      [".json", ESModuleFileType.JSON],
    ];
    for (const [resolvedURL, type] of targetSuffixes.map<[ScriptURL, ESModuleFileType]>(([suffix, type]) => [
      createURL(url.packageMeta, url.subpath + suffix),
      type,
    ])) {
      const file = fs.read(resolvedURL);
      if (fs.exists(file)) {
        return {
          ...file,
          format: type,
        };
      }
    }
    return null;
  };
  const resolveAsDirectory = (url: ScriptURL): ESModuleFile | null => {
    const x = trimSlash(url.subpath);
    const pjsonSubpath = path.join(x, PACKAGE_JSON);
    const pjsonFile = fs.read(createURL(url.packageMeta, pjsonSubpath));
    if (!pjsonFile) {
      return resolveIndex(url);
    }
    try {
      const json: PackageJSON = JSON.parse(pjsonFile.content);
      const main = json.main;
      if (!main) {
        return resolveIndex(url);
      }
      const m = path.join(x, main);
      const mUrl = createURL(url.packageMeta, m);
      return (
        resolveAsFile(mUrl) ??
        resolveIndex(mUrl) ??
        warn(`Deprecated: Resolving package index with "package.json".`, resolveIndex(url))
      );
    } catch (error) {
      return resolveIndex(url);
    }
  };
  const resolveIndex = (url: ScriptURL): ESModuleFile | null => {
    const x = trimSlash(url.subpath);
    const indexJS = createURL(url.packageMeta, `${x}/${INDEX}${jsExt}`);
    const indexJSFile = fs.read(indexJS);
    if (fs.exists(indexJSFile)) {
      return {
        ...indexJSFile,
        format: indexJS.format ?? ESModuleFileType.Script,
      };
    }
    const indexJSON = createURL(url.packageMeta, `${x}/${INDEX}${jsonExt}`);
    const indexJSONFile = fs.read(indexJSON);
    if (fs.exists(indexJSONFile)) {
      return {
        ...indexJSONFile,
        format: indexJSON.format ?? ESModuleFileType.JSON,
      };
    }
    return null;
  };
  const resolveCache: Record<string, PackageMeta> = {};
  const resolvePackage: PackageHost["resolvePackage"] = rawRecursive<[spec: PackageSpec], PackageMeta | null>(
    function* (spec) {
      const { name, specifier } = spec;
      const id = packageId(name, specifier);
      const cached = resolveCache[id];
      if (cached) {
        return cached;
      }
      const packageJSON = registry.resolve(spec);
      if (!packageJSON) {
        return null;
      }
      const meta: PendingPackageMeta = {
        specifier,
        packageJSON,
      };
      // @ts-expect-error later updated type
      resolveCache[id] = meta;
      const withExports = resolveExports(packageJSON, meta);
      const fullDeps = {
        // ...packageJSON.devDependencies,
        ...packageJSON.peerDependencies,
        ...packageJSON.dependencies,
      };
      const depsArray: [string, PackageMeta][] = [];
      for (const [name, specifier] of Object.entries(fullDeps)) {
        if (name.startsWith(definitelyTypedLibPrefix)) {
          // Skip `@types/<pkg>` resolve.
          continue;
        }
        const meta = yield this.call({
          name,
          specifier,
        });
        if (!meta) {
          console.warn(
            `Cannot resolve dependency "${packageId(name, specifier)}" for ${withExports.packageJSON.name}, skipped.`
          );
          continue;
        }
        depsArray.push([name, meta]);
      }
      return Object.assign<PackageMetaWithExports, DependencyAddOn>(withExports, {
        deps: Object.fromEntries(depsArray),
      });
    }
  );
  const requireResolveCache: Record<string, ESModuleFile> = {};
  const requireResolveCacheKey = (id: string, url: ScriptURL) =>
    `${url.packageMeta.packageJSON.name}@${url.packageMeta.packageJSON.version} | ${url.parsed.dir} => ${id}`;
  const resolve: PackageHost["resolve"] = (id, currentURL) => {
    const key = requireResolveCacheKey(id, currentURL);
    const cache = requireResolveCache[key];
    if (cache) {
      return cache;
    }
    const resume = (result: ESModuleFile | null): ESModuleFile | null => {
      if (result) {
        requireResolveCache[key] = result;
      }
      return result;
    };
    if (isRelative(id)) {
      const { dir } = currentURL.parsed;
      const subpath = path.join(dir, id);
      const targetUrl = createURL(currentURL.packageMeta, subpath);
      const file = resolveAsFile(targetUrl) ?? resolveAsDirectory(targetUrl);
      return file ? resume(file) : notFound(id, currentURL);
    }
    const { pkg } = resolvePackageByName(id);
    const depMeta = currentURL.packageMeta.deps[pkg];
    const nextSteps = (meta: PackageMeta | null) => {
      if (!meta) {
        return resume(null);
      }
      const exportURL = accessExport(meta.exportMapping, id);
      if (exportURL) {
        return resume(resolveAsFile(exportURL));
      }
      return resume(resolveAsFile(createURL(meta, toRelative(pkg, id))));
    };
    if (depMeta) {
      return nextSteps(depMeta);
    }
    const currentPackage = currentURL.packageMeta.packageJSON.name;
    if (currentPackage === pkg) {
      return nextSteps(currentURL.packageMeta);
    }
    return nextSteps(
      resolvePackage({
        name: pkg,
        specifier: warn(
          `Dependency "${pkg}" is used by "${currentURL.url}" but not specified in ${PACKAGE_JSON}. Using "${latest}" for dependency versioning.`,
          latest
        ),
      })
    );
  };
  const resolveExports = (packageJSON: PackageJSON, pendingPackageMeta: PendingPackageMeta) => {
    const { name, exports, module, main } = packageJSON;
    const staticMapping: StaticExportMapping = {};
    const dynamicMappings: { pattern: RegExp; ref: ExportReference }[] = [];
    type ExportsEntry = [subpath: string, ref: string, format: ESModuleFileType | null];

    const exportsEntries: ExportsEntry[] =
      typeof exports === "string"
        ? [[selfReference, exports, detectDefaultFormat(packageJSON, path.parse(exports).ext)]]
        : Array.isArray(exports)
        ? exports.map<ExportsEntry>((ref) => {
            const [subpath, format] = getRefSubpath(ref, packageJSON);
            return [subpath, subpath, format];
          })
        : exports
        ? Object.entries(exports).map<ExportsEntry>(([alias, ref]) => {
            const [subpath, format] = getRefSubpath(ref, packageJSON);
            return [alias, subpath, format];
          })
        : module
        ? [[selfReference, module, ESModuleFileType.Module]]
        : [];
    for (const [subpath, ref, format] of exportsEntries) {
      // glob patterns
      if (subpath.includes("*")) {
        dynamicMappings.push({
          pattern: new RegExp(subpath.replace("*", ".+?")),
          ref,
        });
      } else {
        if (subpath.endsWith(slash)) {
          console.warn(`Invalid export path "${subpath}", ignored.`);
          continue;
        }
        const importPath = path.join(name, subpath);
        // Only the first export mapping rule applies.
        if (!(importPath in staticMapping)) {
          // @ts-expect-error later updated type
          const finalMeta: PackageMeta = pendingPackageMeta;
          const staticResolvedURL = createURL(finalMeta, ref, format);
          staticMapping[importPath] = staticResolvedURL;
        }
      }
    }
    const mapping: ExportMapping = (id) => {
      if (id in staticMapping) {
        return staticMapping[id];
      }
      const relativePath = toRelative(name, id);
      const match = dynamicMappings.find(({ pattern }) => relativePath.match(pattern));
      // @ts-expect-error later updated type
      const finalMeta: PackageMeta = pendingPackageMeta;
      if (!match) {
        if (id === name && main) {
          return createURL(finalMeta, main);
        }
        return undefined;
      }
      return createURL(finalMeta, ...getRefSubpath(match.ref, packageJSON));
    };
    return Object.assign<PendingPackageMeta, ExportAddOn>(pendingPackageMeta, {
      exportMapping: mapping,
      staticMapping,
    });
  };
  const createURL: PackageHost["createURL"] = (pkg, subpath, format) => {
    const parsed = path.parse(subpath);
    const { ext } = parsed;
    return {
      url: `${fs.root}/${pkg.packageJSON.name}@${pkg.packageJSON.version}/${subpath.replace(/^\.\/?/, "")}`,
      subpath,
      host,
      packageMeta: pkg,
      parsed,
      format: format ?? detectFormat(pkg.packageJSON, ext),
    };
  };
  const createAnonymousURL: PackageHost["createAnonymousURL"] = (subpath, deps, tag) =>
    createURL(
      {
        specifier: latest,
        exportMapping: () => undefined,
        staticMapping: {},
        packageJSON: {
          name: `<internal: ${tag ?? "the project"}>`,
          version: "0.0.0",
          dependencies: Object.fromEntries(Object.entries(deps).map(([pkg, meta]) => [pkg, meta.packageJSON.version])),
        },
        deps,
      },
      subpath
    );
  const host: PackageHost = {
    resolvePackage,
    resolve,
    createURL,
    createAnonymousURL,
  };
  return host;
};
