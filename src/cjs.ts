import { type ESModuleFile, ESModuleFileType, type PackageHost, type ScriptURL } from "./core";
import { notFound, notSupported } from "./errors";
import { type Func, proxyGlobalVariableForCode, type Static, trimSlash, virgin, warn } from "./utils";

export interface ModuleExports {
  readonly __esModule?: true;
}

export const createExport = (esm?: boolean): ModuleExports => {
  const exports = virgin();
  if (esm) {
    Object.defineProperties(esm, {
      __esModule: {
        value: true,
      },
    });
  }
  return exports;
};

export const createModule = (url: ScriptURL, require: NodeRequire, exports: ModuleExports): NodeJS.Module => {
  const id = url.url;
  const module: NodeJS.Module = {
    children: [],
    exports,
    isPreloading: false,
    loaded: false,
    require,
    path: id,
    id,
    paths: [],
    filename: url.parsed.base,
    parent: null,
  };
  return module;
};

export const createResolve = (url: ScriptURL, host: PackageHost): NodeJS.RequireResolve => {
  const resolveStatic: Static<NodeJS.RequireResolve> = {
    paths: notSupported,
  };
  const resolve: Func<NodeJS.RequireResolve> = (id, options) => {
    let resolved: string;
    host.resolve(id, url).then((file) => {
      if (!file) {
        return notFound(id, url);
      }
      // It's synchronous, althought it seems to be executed in `Promise.then` callback.
      resolved = file.url.url;
      return;
    });
    return options ? warn("Options for require.resolve(id, [options]) is not used actually.", resolved!) : resolved!;
  };
  return Object.assign(resolve, resolveStatic);
};

const loadAsCJSModule = (
  file: ESModuleFile,
  host: PackageHost,
  loader: (exports: ModuleExports, require: NodeJS.Require, module: NodeJS.Module) => void
): NodeJS.Module => {
  const { url } = file;
  const exports = createExport();
  const require = createRequire(url, host);
  const module = createModule(url, require, exports);
  cache[url.url] = module;
  loader(exports, require, module);
  module.loaded = true;
  return module;
};

export const loadCJSModule = (file: ESModuleFile, host: PackageHost): NodeJS.Module =>
  loadAsCJSModule(file, host, (exports, require, module) => {
    const { url, content } = file;
    const {
      url: __filename,
      parsed: { base },
    } = url;
    createCJSFactory(content, {
      __dirname: trimSlash(__filename.replace(base, "")),
      __filename,
      exports,
      module,
      require,
    })();
  });

export const loadJSONModule = (file: ESModuleFile, host: PackageHost): NodeJS.Module =>
  loadAsCJSModule(file, host, (_exports, _require, module) => {
    module.exports = JSON.parse(file.content);
  });

const cache: NodeJS.Dict<NodeJS.Module> = {};
export const createRequire = (url: ScriptURL, host: PackageHost): NodeJS.Require => {
  const resolve = createResolve(url, host);
  const requireStatic: Static<NodeJS.Require> = {
    cache,
    main: undefined,
    resolve,
    extensions: {
      ".js": notSupported,
      ".json": notSupported,
      ".node": notSupported,
    },
  };
  const require: Func<NodeJS.Require> = (id) => {
    let module: NodeJS.Module;
    host.resolve(id, url).then((file) => {
      if (!file) {
        return notFound(id, url);
      }
      const cached = cache[file.url.url];
      if (cached) {
        // It's synchronous, althought it seems to be executed in `Promise.then` callback.
        module = cached;
        return;
      }
      switch (file.format) {
        case ESModuleFileType.JSON:
          // It's synchronous, althought it seems to be executed in `Promise.then` callback.
          module = loadJSONModule(file, host);
          break;
        case ESModuleFileType.Script:
          // It's synchronous, althought it seems to be executed in `Promise.then` callback.
          module = loadCJSModule(file, host);
          break;
        default:
          // ECMA module script cannot be loaded by `require`.
          return notSupported();
      }
      return;
    });
    return module!.exports;
  };
  return Object.assign(require, requireStatic);
};

export interface CJSGlobals {
  __dirname: string;
  __filename: string;
  require: NodeRequire;
  module: NodeJS.Module;
  exports: ModuleExports;
}

export const createCJSFactory = proxyGlobalVariableForCode<CJSGlobals>;
