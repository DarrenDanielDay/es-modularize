import { container, implementation, provide } from "func-di";
import { BrowserFSImpl, createBlob } from "./browser.js";
import type { ImportMapJSON } from "./core.js";
import { $config, $projectLoader } from "./deps.js";
import { PackageHostImpl } from "./host.js";
import { NetReaderImpl } from "./net.js";
import { patchConfigWithDefaults, ProjectLoaderConfig, ProjectLoaderImpl } from "./project-loader.js";
import { RegistryImpl } from "./registry.js";
import { ResolvedRegistryImpl } from "./resolved.js";
import { PackageResolverImpl } from "./resolver.js";
import { create } from "./utils.js";

const root = container([
  provide.stateful(BrowserFSImpl),
  provide.stateful(NetReaderImpl),
  provide.stateful(RegistryImpl),
  provide.stateful(PackageHostImpl),
  provide.stateful(ProjectLoaderImpl),
  provide.stateful(PackageResolverImpl),
]);
const _ESModularize = {
  createProjectLoader(config?: ProjectLoaderConfig) {
    const ioc = root.register([provide.stateful(implementation($config, patchConfigWithDefaults(config)))]);
    const projectLoader = ioc.request($projectLoader);
    return projectLoader;
  },
  createStaticProjectLoader(config?: ProjectLoaderConfig) {
    const ioc = root.override([
      provide.stateful(ResolvedRegistryImpl),
      provide.stateful(implementation($config, patchConfigWithDefaults(config))),
    ]);
    return ioc.request($projectLoader);
  },
  /**
   * Load a script directly, useful for UMD sources.
   * @param path script path
   * @returns sub clause
   */
  load(path: string) {
    const umd = (globalNamespace: string) => {
      const globalObject = Reflect.get(globalThis, globalNamespace);
      if (!globalObject || typeof globalObject !== "object") {
        return null;
      }

      const exportNames = Object.keys(globalObject).join(",");
      const code = `const{${exportNames}}=globalThis["${globalNamespace}"];export{${exportNames}};export default globalThis["${globalNamespace}"];`;
      return createBlob(code);
    };
    return {
      sync() {
        const xhr = create(XMLHttpRequest);
        xhr.open("GET", path, false);
        xhr.send();
        (0, eval)(xhr.response);
        return {
          umd,
        };
      },
      async async() {
        const s = document.createElement("script");
        s.src = path;
        (document.body ?? document.head).appendChild(s);
        await create(Promise<void>, (resolve) => {
          const handler = () => {
            s.removeEventListener("load", handler);
            resolve();
          };
          s.addEventListener("load", handler);
        });
        return {
          umd,
        };
      },
    };
  },
  /**
   * Build and create an HTMLScriptElement like this:
   *
   * ```html
   * <script type="importmap">
   *  {"imports": {"npm-package-name": "some URL of JavaScript file in ES module format"}}
   * </script>
   * ```
   *
   * @param map import map
   */
  build(map: ImportMapJSON) {
    const importmap = document.createElement("script");
    importmap.type = "importmap";
    importmap.textContent = JSON.stringify(map);
    importmap.nonce = undefined;
    const firstScript = document.currentScript || document.querySelector("script");
    if (firstScript) {
      firstScript.after(importmap);
    } else {
      (document.body ?? document.head).appendChild(importmap);
    }
  },
};
declare global {
  var ESModularize: typeof _ESModularize;
}
Object.assign(globalThis, { ESModularize: _ESModularize });
