import type { ScriptURL } from "./core";
import { die } from "./utils";

export const notFound = (id: string, url: ScriptURL) => die(`Cannot find module "${id}" from "${url.url}"`);
export const notSupported = (msg?: string) => die(`Not supported: ${msg}`);
export const noSupport = () => die(`No support.`);
