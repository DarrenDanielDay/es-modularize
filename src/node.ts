import { existsSync, readFileSync } from "fs";
import { factory, inject } from "func-di";
import { join } from "path";
import { PACKAGE_JSON } from "./constants.js";
import { ESModuleFileType, type FS, type SourceFile } from "./core.js";
import { $fs, $registry } from "./deps.js";
import type { PackageRegistry } from "./registry.js";

const js = "application/javascript";
const json = "application/json";
const root = join(process.cwd(), "node_modules");
const createNodeFS = (): FS => {
  const exists: FS["exists"] = (file): file is SourceFile => {
    return !!file;
  };
  const read: FS["read"] = (url) => {
    if (!existsSync(url.url)) {
      return null;
    }
    return {
      content: readFileSync(join(root, url.packageMeta.packageJSON.name, url.subpath), { encoding: "utf-8" }),
      contentType: url.format ? (url.format === ESModuleFileType.JSON ? json : js) : js,
      redirected: false,
      url,
    };
  };
  return {
    root,
    exists,
    read,
  };
};
export const LocalRegistryImpl = inject({}).implements($registry, () => {
  const resolve: PackageRegistry["resolve"] = (spec) => {
    try {
      const pjson = readFileSync(join(root, spec.name, PACKAGE_JSON), { encoding: "utf-8" });
      return JSON.parse(pjson);
    } catch (error) {
      return null;
    }
  };
  return {
    resolve,
  };
});
export const NodeFSImpl = factory($fs, createNodeFS);
