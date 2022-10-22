import { createBlob, createBrowserFS } from "./browser";
import type { ImportMapJSON } from "./core";
import { createPackageHost } from "./host";
import { createNetReader } from "./net";
import { createProjectLoader, ProjectLoaderConfig } from "./project-loader";
import { createPackageRegistry } from "./registry";
import { create } from "./utils";

const _ESModularize = {
  createProjectLoader(config?: ProjectLoaderConfig) {
    const fs = createBrowserFS(config?.cdnRoot);
    const net = createNetReader(fetch);
    const registry = createPackageRegistry(net, config?.registry);
    const host = createPackageHost(fs, registry);
    const projectLoader = createProjectLoader(host, config);
    return projectLoader;
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
