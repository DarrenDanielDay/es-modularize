import path from "path-browserify";
import { relativeTo, selfReference } from "./constants";
import {
  type FS,
  type PackageHost,
  type ScriptURL,
  type SourceFile,
  ESModuleFileType,
  resolvePackageByName,
  PackageJSON,
  ExportReference,
  PackageMeta,
  PendingPackageMeta,
  ESModuleFile,
  PackageMetaWithExports,
  accessExport,
  ExportAddOn,
  DependencyAddOn,
  ExportMapping,
  StaticExportMapping,
} from "./core";
import { notFound, notSupported } from "./errors";
import type { PackageRegistry } from "./registry";
import { chainPerform, die, isRelative, performAll, performAs, Resume, warn } from "./utils";
const getRefSubpath = (ref: ExportReference) =>
  typeof ref === "string" ? ref : ref.import ?? ref.browser ?? ref.worker ?? ref.require ?? ref.default;
export const createPackageHost = (fs: FS, registry: PackageRegistry): PackageHost => {
  const resolveAsFile = performAs((resume: Resume<ESModuleFile | null>, url: ScriptURL) => {
    const { ext } = url.parsed;
    const targetSuffixes: [string, ESModuleFileType][] = [
      [
        "",
        ext === ".mjs" ? ESModuleFileType.Module : ext === ".json" ? ESModuleFileType.JSON : ESModuleFileType.Script,
      ],
      [".js", url.packageMeta.packageJSON.type === "module" ? ESModuleFileType.Module : ESModuleFileType.Script],
      [".json", ESModuleFileType.JSON],
    ];
    chainPerform<[ScriptURL, ESModuleFileType], [SourceFile | null, ESModuleFileType]>(
      performAs((resume, url, type) => fs.read(url).then((file) => resume([file, type]))),
      targetSuffixes.map(([suffix, type]) => [createURL(url.packageMeta, url.subpath + suffix), type]),
      (x) => !!x
    ).then(([file, type]) => {
      if (file) {
        resume({
          ...file,
          format: type,
        });
      } else {
        resume(null);
      }
    });
  });

  const resolvePackage: PackageHost["resolvePackage"] = performAs((resume, spec) => {
    registry.resolve(spec).then((packageJSON) => {
      if (!packageJSON) {
        return resume(null);
      }
      const meta: PendingPackageMeta = {
        packageJSON,
      };
      resolveExports(packageJSON, meta).then((withExports) => {
        resolveDependencies(withExports).then(resume);
      });
    });
  });
  const requireResolveCache: Record<string, ESModuleFile> = {};
  const requireResolveCacheKey = (id: string, url: ScriptURL) =>
    `${url.packageMeta.packageJSON.name}@${url.packageMeta.packageJSON.version} | ${url.parsed.dir} => ${id}`;
  const resolve: PackageHost["resolve"] = performAs((_resume, id, currentURL) => {
    const cache = requireResolveCache[requireResolveCacheKey(id, currentURL)];
    if (cache) {
      return _resume(cache);
    }
    const resume: typeof _resume = (result) => {
      if (result) {
        requireResolveCache[requireResolveCacheKey(id, currentURL)] = result;
      }
      _resume(result);
    };
    if (isRelative(id)) {
      const { dir } = currentURL.parsed;
      const subpath = path.join(dir, id);
      return resolveAsFile(createURL(currentURL.packageMeta, subpath)).then((file) =>
        file ? resume(file) : notFound(id, currentURL)
      );
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
      resolveAsFile(exportURL).then(resume);
    };
    if (depMeta) {
      return nextSteps(depMeta);
    }
    const currentPackage = currentURL.packageMeta.packageJSON.name;
    if (currentPackage === pkg) {
      return nextSteps(currentURL.packageMeta);
    }
    resolvePackage({
      name: pkg,
      specifier: warn(
        `Dependency "${pkg}" is used by "${currentURL.url}" but not specified in package.json. Using "latest" for dependency versioning.`,
        "latest"
      ),
    }).then(nextSteps);
  });
  const resolveExports = performAs(
    (resume: Resume<PackageMetaWithExports>, packageJSON: PackageJSON, pendingPackageMeta: PendingPackageMeta) => {
      const { name, exports, main } = packageJSON;
      // Currently only support object exports/main field.
      // TODO: Full support for exports/main field.
      if (typeof exports === "string" || Array.isArray(exports)) {
        return notSupported();
      }

      const staticMapping: StaticExportMapping = {};
      const dynamicMappings: { pattern: RegExp; ref: ExportReference }[] = [];
      const exportsObject = Object.entries(exports ?? { [selfReference]: main ?? "./index.js" });
      for (const [subpath, ref] of exportsObject) {
        // glob patterns
        if (subpath.includes("*")) {
          dynamicMappings.push({
            pattern: new RegExp(subpath.replace("*", ".+?")),
            ref,
          });
        } else {
          // @ts-expect-error later updated type
          const staticResolvedURL = createURL(pendingPackageMeta, getRefSubpath(ref) ?? notSupported());
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
        return createURL(pendingPackageMeta, getRefSubpath(match.ref) ?? notSupported());
      };
      return resume(
        Object.assign<PendingPackageMeta, ExportAddOn>(pendingPackageMeta, { exportMapping: mapping, staticMapping })
      );
    }
  );
  const resolveDependencies = performAs((resume: Resume<PackageMeta>, withExports: PackageMetaWithExports) => {
    const packageJSON = withExports.packageJSON;
    const fullDeps = {
      // ...packageJSON.devDependencies,
      ...packageJSON.peerDependencies,
      ...packageJSON.dependencies,
    };
    performAll(
      Object.entries(fullDeps),
      performAs((resume: Resume<[name: string, meta: PackageMeta]>, name, specifier) => {
        resolvePackage({
          name,
          specifier,
        }).then((meta) =>
          meta
            ? resume([name, meta])
            : die(`Cannot resolve dependency "${name}@${specifier}" for ${withExports.packageJSON.name}`)
        );
      })
    ).then((depsArray) =>
      resume(
        Object.assign<PackageMetaWithExports, DependencyAddOn>(withExports, { deps: Object.fromEntries(depsArray) })
      )
    );
  });
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
