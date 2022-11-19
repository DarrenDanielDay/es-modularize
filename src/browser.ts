import { inject } from "func-di";
import { globalEvaluatedVariable } from "./constants.js";
import type { FS, ScriptURL, SourceFile } from "./core.js";
import { $config, $fs, $net } from "./deps.js";
import type {  NetReader } from "./net.js";
import { create, trimSlash } from "./utils.js";
export const BrowserFSImpl = inject({ config: $config, net: $net }).implements($fs, (ctx) =>
  createBrowserFS(ctx.net, ctx.config.cdnRoot)
);
const createBrowserFS = (net: NetReader, cdnRoot: string): FS => {
  cdnRoot = trimSlash(cdnRoot);
  const read: FS["read"] = (url) => {
    const requestURL = resolveRequestURL(url);
    const response = net.read(requestURL);
    if (!response) {
      return null;
    }
    const { content, contentType } = response;
    if (typeof content !== "string" /** invalid script content */) {
      return null;
    }
    return {
      content,
      contentType,
      redirected: response.url !== requestURL,
      url,
    };
  };
  const resolveRequestURL = (url: ScriptURL) => {
    return url.url;
  };
  const exists: FS["exists"] = (file): file is SourceFile => {
    if (!file) {
      return false;
    }
    const { contentType, redirected } = file;
    if (redirected) {
      return false;
    }
    if (!contentType) {
      return true;
    }
    return !contentType.match(/html|plain/);
  };
  return {
    root: cdnRoot,
    read,
    exists,
  };
};
const globalEvaluated: Record<string, unknown> = {};
Object.assign(globalThis, { [globalEvaluatedVariable]: globalEvaluated });

export const createBlob = (text: string, type = "application/javascript") =>
  URL.createObjectURL(create(Blob, [text], { type }));

export const createESMProxyScript = (module: NodeJS.Module) => {
  const { exports } = module;
  const id = module.id;
  globalEvaluated[id] = exports;
  const expression = `${globalEvaluatedVariable}[${JSON.stringify(id)}]`;
  const exportNames = Object.keys(exports).join(",");
  const code = `\
let {${exportNames}} = ${expression};
export {${exportNames}};
export default ${expression};`;
  return createBlob(code);
};
