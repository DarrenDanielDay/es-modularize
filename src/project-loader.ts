import { inject } from "func-di";
import { createBlob, createESMProxyScript } from "./browser.js";
import { loadCJSModule } from "./cjs.js";
import { CONTENT_JSON } from "./constants.js";
import { type Dependencies, ESModuleFileType, type ImportMapJSON, type PackageHost, type PackageMeta } from "./core.js";
import { $config, $host, $projectLoader, $net, $resolver } from "./deps.js";
import type { NetReader } from "./net.js";
import { NodePolyfills, polyfillProcess } from "./node-polyfills.js";
import type { PackageResolver, ResolvedCache } from "./resolver.js";

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
  /**
   * Similar to {@link ProjectLoader.load}, but using static resolved dependency data.
   */
  loadResolved(): ImportMapJSON;
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
   * The data path of statically resolved `package.json`s.
   * @default "./resolved.json"
   */
  resolvedAt: string;
  /**
   * The ndoe global variables you want to inject.
   * Useful when referenced npm packages are using `process.env.NODE_ENV` etc.
   */
  nodeGlobals: NodePolyfills;
}>;
export const patchConfigWithDefaults = (config?: ProjectLoaderConfig | undefined) => {
  const result: Required<ProjectLoaderConfig> = {
    cdnRoot: config?.cdnRoot ?? "https://unpkg.com",
    registry: config?.registry ?? "https://registry.npmjs.org",
    nodeGlobals: config?.nodeGlobals ?? {
      process: polyfillProcess(),
    },
    resolvedAt: config?.resolvedAt ?? "./resolved.json",
  };
  return result;
};

export const ProjectLoaderImpl = inject({ host: $host, net: $net, config: $config, resolver: $resolver }).implements(
  $projectLoader,
  (ctx) => createProjectLoader(ctx.host, ctx.resolver, ctx.net, ctx.config)
);
const createProjectLoader = (
  host: PackageHost,
  resolver: PackageResolver,
  net: NetReader,
  config: Required<ProjectLoaderConfig>
): ProjectLoader => {
  const loadImportMap = (
    resolvedDependencies: ResolvedCache,
    resolvedEntries: [string, PackageMeta][],
    loadOnly: string[] | undefined
  ) => {
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
            return [[importPath, createBlob(file.content, CONTENT_JSON)]];
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
  const preload = () => {
    Object.assign(globalThis, config?.nodeGlobals);
  };
  const load: ProjectLoader["load"] = (deps, loadOnly) => {
    preload();
    const resolvedDependencies = resolver.resolveAll(deps);
    const resolvedEntries = Object.entries(resolvedDependencies);
    return loadImportMap(resolvedDependencies, resolvedEntries, loadOnly);
  };
  const loadResolved: ProjectLoader["loadResolved"] = () => {
    preload();
    const staticData = resolver.resolveStatic();
    const { deps, loadOnly } = staticData;
    const resolvedDependencies = resolver.resolveAll(deps);
    const resolvedEntries = Object.entries(resolvedDependencies);
    return loadImportMap(resolvedDependencies, resolvedEntries, loadOnly);
  };
  return {
    load,
    loadResolved,
  };
};
