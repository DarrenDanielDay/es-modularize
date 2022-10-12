import path from "path-browserify";
import { rawRecursive } from "taio/esm/libs/custom/algorithms/recursive.mjs";
import { latest, relativeTo, selfReference } from "./constants";
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
} from "./core";
import { notFound, notSupported } from "./errors";
import type { PackageRegistry } from "./registry";
import { die, isRelative, warn } from "./utils";
const exportReferenceNotSupported = (ref: ExportReference) =>
  notSupported(`Cannot find export subpath: ${JSON.stringify(ref)}`);
const getRefSubpath = (ref: ExportReference): string => {
  if (typeof ref === "string") {
    return ref;
  }
  if (Array.isArray(ref)) {
    return getRefSubpath(ref.find((r) => getRefSubpath(r)) ?? exportReferenceNotSupported(ref));
  }
  return ref.import ?? ref.browser ?? ref.worker ?? ref.require ?? ref.default ?? exportReferenceNotSupported(ref);
};
export const createPackageHost = (fs: FS, registry: PackageRegistry): PackageHost => {
  const resolveAsFile = (url: ScriptURL): ESModuleFile | null => {
    const { ext } = url.parsed;
    const targetSuffixes: [string, ESModuleFileType][] = [
      [
        "",
        ext === ".mjs" ? ESModuleFileType.Module : ext === ".json" ? ESModuleFileType.JSON : ESModuleFileType.Script,
      ],
      [".js", url.packageMeta.packageJSON.type === "module" ? ESModuleFileType.Module : ESModuleFileType.Script],
      [".json", ESModuleFileType.JSON],
    ];
    for (const [resolvedURL, type] of targetSuffixes.map<[ScriptURL, ESModuleFileType]>(([suffix, type]) => [
      createURL(url.packageMeta, url.subpath + suffix),
      type,
    ])) {
      const file = fs.read(resolvedURL);
      if (file) {
        return {
          ...file,
          format: type,
        };
      }
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
        const meta = yield this.call({
          name,
          specifier,
        });
        depsArray.push(
          meta
            ? [name, meta]
            : die(`Cannot resolve dependency "${packageId(name, specifier)}" for ${withExports.packageJSON.name}`)
        );
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
    const cache = requireResolveCache[requireResolveCacheKey(id, currentURL)];
    if (cache) {
      return cache;
    }
    const resume = (result: ESModuleFile | null): ESModuleFile | null => {
      if (result) {
        requireResolveCache[requireResolveCacheKey(id, currentURL)] = result;
      }
      return result;
    };
    if (isRelative(id)) {
      const { dir } = currentURL.parsed;
      const subpath = path.join(dir, id);
      const file = resolveAsFile(createURL(currentURL.packageMeta, subpath));
      return file ? resume(file) : notFound(id, currentURL);
    }
    const { pkg } = resolvePackageByName(id);
    const depMeta = currentURL.packageMeta.deps[pkg];
    const nextSteps = (meta: PackageMeta | null) => {
      if (!meta) {
        return resume(null);
      }
      const exportURL = accessExport(meta.exportMapping, id);
      if (!exportURL) {
        return resume(null);
      }
      return resume(resolveAsFile(exportURL));
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
          `Dependency "${pkg}" is used by "${currentURL.url}" but not specified in package.json. Using "${latest}" for dependency versioning.`,
          latest
        ),
      })
    );
  };
  const resolveExports = (packageJSON: PackageJSON, pendingPackageMeta: PendingPackageMeta) => {
    const { name, exports, main } = packageJSON;
    const staticMapping: StaticExportMapping = {};
    const dynamicMappings: { pattern: RegExp; ref: ExportReference }[] = [];
    const exportsObject: [string, ExportReference][] =
      typeof exports === "string"
        ? [[selfReference, exports]]
        : Array.isArray(exports)
        ? exports.map((ref) => [getRefSubpath(ref), ref])
        : Object.entries(exports ?? { [selfReference]: main ?? "./index.js" });
    for (const [subpath, ref] of exportsObject) {
      // glob patterns
      if (subpath.includes("*")) {
        dynamicMappings.push({
          pattern: new RegExp(subpath.replace("*", ".+?")),
          ref,
        });
      } else {
        // @ts-expect-error later updated type
        const staticResolvedURL = createURL(pendingPackageMeta, getRefSubpath(ref));
        staticMapping[path.join(name, subpath)] = staticResolvedURL;
      }
    }
    const mapping: ExportMapping = (id) => {
      if (id in staticMapping) {
        return staticMapping[id];
      }
      const relativePath = id.replace(new RegExp(`^${name}`), relativeTo);
      const match = dynamicMappings.find(({ pattern }) => relativePath.match(pattern));
      if (!match) {
        return undefined;
      }
      // @ts-expect-error later updated type
      return createURL(pendingPackageMeta, getRefSubpath(match.ref));
    };
    return Object.assign<PendingPackageMeta, ExportAddOn>(pendingPackageMeta, {
      exportMapping: mapping,
      staticMapping,
    });
  };
  const createURL: PackageHost["createURL"] = (pkg, subpath) => ({
    url: `${fs.root}/${pkg.packageJSON.name}@${pkg.packageJSON.version}/${subpath.replace(/^\.\//, "")}`,
    subpath,
    host,
    packageMeta: pkg,
    parsed: path.parse(subpath),
  });
  const createAnonymousURL: PackageHost["createAnonymousURL"] = (subpath, deps, tag) =>
    createURL(
      {
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
