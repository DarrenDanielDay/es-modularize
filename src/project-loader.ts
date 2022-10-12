import { createBlob, createESMProxyScript } from "./browser";
import { loadCJSModule } from "./cjs";
import { type Dependencies, ESModuleFileType, type ImportMapJSON, type PackageHost, type PackageMeta } from "./core";
import type { NodePolyfills } from "./node-polyfills";
import { performAll, performAs, Performed, Resume } from "./utils";

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
  load(deps: Dependencies, loadOnly?: string[]): Performed<ImportMapJSON>;
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
  const load: ProjectLoader["load"] = performAs((resume, deps, loadOnly) => {
    Object.assign(globalThis, config?.nodeGlobals);
    performAll(
      Object.entries(deps),
      performAs((resume: Resume<[pkg: string, meta: PackageMeta | null]>, name, specifier) => {
        host.resolvePackage({ name, specifier }).then((meta) => resume([name, meta]));
      })
    ).then((entries) => {
      const resolvedEntries = entries.filter((e): e is [pkg: string, meta: PackageMeta] => !!e[1]);
      const resolvedDependencies = Object.fromEntries(resolvedEntries);
      const projectURL = host.createAnonymousURL("./index.js", resolvedDependencies);
      performAll(
        resolvedEntries.flatMap(([, meta]) => Object.entries(meta.staticMapping)),
        performAs((resume: Resume<[path: string, importURL: string][]>, importPath, url) => {
          if (loadOnly && !loadOnly.includes(importPath)) {
            return resume([]);
          }
          host.resolve(importPath, projectURL).then((file) => {
            if (!file) {
              return resume([]);
            }
            switch (file.format) {
              case ESModuleFileType.Script: {
                const module = loadCJSModule(file, host);
                const proxyScriptURL = createESMProxyScript(module);
                return resume([[importPath, proxyScriptURL]]);
              }
              case ESModuleFileType.JSON:
                return resume([[importPath, createBlob(file.content, "application/json")]]);
              case ESModuleFileType.Module:
                return resume([[importPath, file.url.url]]);
              default:
                break;
            }
          });
        })
      ).then((groups) => {
        const mapping = Object.fromEntries(groups.flatMap((group) => group));
        resume({
          imports: mapping,
        });
      });
    });
  });
  return {
    load,
  };
};
