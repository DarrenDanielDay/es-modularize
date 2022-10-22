import { globalEvaluatedVariable } from "./constants";
import type { FS, ScriptURL, SourceFile } from "./core";
import { createNetReader } from "./net";
import { create, trimSlash } from "./utils";

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
  const exists: FS['exists'] = (file): file is SourceFile => {
    if (!file) {
      return false;
    }
    const { contentType } = file
    if (!contentType) {
      return true;
    }
    return !contentType.match(/html|plain/)
  }
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
