import { rawRecursiveGenerator } from "taio/esm/libs/custom/algorithms/recursive.mjs";
import { createBlob, createESMProxyScript } from "./browser";
import { loadCJSModule } from "./cjs";
import { type Dependencies, ESModuleFileType, type ImportMapJSON, type PackageHost, type PackageMeta } from "./core";
import type { NodePolyfills } from "./node-polyfills";

export type ProjectLoader = {
  /**
   * Load a project's dependency import map.
   * **WARNING:**
   * If {@link loadOnly} is not specified,
   * all exports and dependency scripts will be resolved, downloaded and evaluated.
   * The browser may send thousands of HTTP requests even if you just imported a simple package like `react-dom`!
   *
   * @param deps the dependecy mapping
   * @param loadOnly the import paths you want to create alias, default to all possible import paths
   */
  load(deps: Dependencies, loadOnly?: string[]): ImportMapJSON;
};

export type ProjectLoaderConfig = Partial<{
  /**
   * @default "https://registry.npmjs.org"
   */
  cdnRoot: string;
  /**
   * @default "https://unpkg.com"
   */
  registry: string;
  /**
   * The ndoe global variables you want to inject.
   * Useful when referenced npm packages are using `process.env.NODE_ENV` etc.
   */
  nodeGlobals: NodePolyfills;
}>;

export const createProjectLoader = (host: PackageHost, config?: ProjectLoaderConfig): ProjectLoader => {
  const load: ProjectLoader["load"] = (deps, loadOnly) => {
    Object.assign(globalThis, config?.nodeGlobals);
    type TryResolvedEntry = [string, PackageMeta | null];
    type ResolvedEntry = [pkg: string, meta: PackageMeta];
    const entries = Object.entries(deps).map<TryResolvedEntry>(([name, specifier]) => {
      const meta = host.resolvePackage({ name, specifier });
      return [name, meta];
    });
    const visited = new Set<PackageMeta>();
    const flattenRecursive = rawRecursiveGenerator<[TryResolvedEntry], ResolvedEntry>(function* ([name, meta]) {
      if (!meta || visited.has(meta)) {
        return;
      }
      visited.add(meta);
      yield this.value([name, meta]);
      for (const entry of Object.entries(meta.deps)) {
        yield this.sequence(entry);
      }
    });
    const resolvedEntries = entries.flatMap((e) => [...flattenRecursive(e)]);
    const resolvedDependencies = Object.fromEntries(resolvedEntries);
    const projectURL = host.createAnonymousURL("./index.js", resolvedDependencies);
    const groups = resolvedEntries
      .flatMap(([, meta]) => Object.entries(meta.staticMapping))
      .map(([importPath, url]) => {
        if (loadOnly && !loadOnly.includes(importPath)) {
          return [];
        }
        const file = host.resolve(importPath, projectURL);
        if (!file) {
          return [];
        }
        switch (file.format) {
          case ESModuleFileType.Script: {
            const module = loadCJSModule(file, host);
            const proxyScriptURL = createESMProxyScript(module);
            return [[importPath, proxyScriptURL]];
          }
          case ESModuleFileType.JSON:
            return [[importPath, createBlob(file.content, "application/json")]];
          case ESModuleFileType.Module:
            return [[importPath, file.url.url]];
          default:
            return [];
        }
      });
    const mapping = Object.fromEntries(groups.flatMap((group) => group));
    return {
      imports: mapping,
    };
  };
  return {
    load,
  };
};
