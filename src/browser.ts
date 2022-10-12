import { globalEvaluatedVariable } from "./constants";
import type { FS, ScriptURL } from "./core";
import { createNetReader } from "./net";
import { trimSlash } from "./utils";

export const createBrowserFS = (cdnRoot = "https://unpkg.com"): FS => {
  cdnRoot = trimSlash(cdnRoot);
  const net = createNetReader(window.fetch);
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
  return {
    root: cdnRoot,
    read,
  };
};
const globalEvaluated: Record<string, unknown> = {};
Object.assign(globalThis, { [globalEvaluatedVariable]: globalEvaluated });

export const createBlob = (text: string, type = "application/javascript") =>
  URL.createObjectURL(new Blob([text], { type }));

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
