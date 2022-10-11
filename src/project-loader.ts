import { createBlob, createESMProxyScript } from "./browser";
import { loadCJSModule } from "./cjs";
import { Dependencies, ESModuleFileType, ImportMapJSON, PackageHost, PackageMeta } from "./core";
import type { NodePolyfills } from "./node-polyfills";
import { DeepPartial, Perform, performAll, performAs, Resume } from "./utils";

export type ProjectLoader = {
  /** load */
  load: Perform<[deps: Dependencies, loadOnly?: string[]], ImportMapJSON>;
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
        resolvedEntries.flatMap(([, meta]) => Object.entries(meta.exportMapping)),
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