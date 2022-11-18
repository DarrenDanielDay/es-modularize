import { writeFile } from "fs/promises";
import { container, implementation, provide } from "func-di";
import { join } from "path";
import type { Dependencies, PackageJSON } from "./core.js";
import { $config, $resolver } from "./deps.js";
import { PackageHostImpl } from "./host.js";
import { LocalRegistryImpl, NodeFSImpl } from "./node.js";
import { patchConfigWithDefaults } from "./project-loader.js";
import { PackageResolverImpl } from "./resolver.js";
export type StaticRegistryData = {
  deps: Dependencies;
  loadOnly?: string[];
  resolved: Record<string, PackageJSON>;
};
export const loadStatically = (deps: Dependencies, loadOnly?: string[]): StaticRegistryData => {
  const ioc = container([
    provide.stateful(PackageHostImpl),
    provide.stateful(NodeFSImpl),
    provide.stateful(LocalRegistryImpl),
    provide.stateful(PackageResolverImpl),
    provide.stateful(implementation($config, patchConfigWithDefaults({}))),
  ]);
  const resolvedAll = ioc.request($resolver).resolveAll(deps);
  const resolved = Object.fromEntries(Object.entries(resolvedAll).map(([name, meta]) => [name, meta.packageJSON]));
  return {
    deps,
    loadOnly,
    resolved,
  };
};

export const loadStaticallyAndSaveDefaultJSON = async (dir: string, ...args: Parameters<typeof loadStatically>) => {
  const data = loadStatically(...args);
  await writeFile(join(dir, patchConfigWithDefaults().resolvedAt), JSON.stringify(data), { encoding: "utf-8" });
};
