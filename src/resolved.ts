import { inject } from "func-di";
import { packageId } from "./core.js";
import { $registry, $resolver } from "./deps.js";
import type { PackageRegistry } from "./registry.js";
import type { StaticRegistryData } from "./static-loader.js";

export const ResolvedRegistryImpl = $registry.implementAs(({ request }) => {
  let data: StaticRegistryData | null = null;
  const resolve: PackageRegistry["resolve"] = (spec) => {
    if (!data) {
      data = request($resolver).resolveStatic();
    }
    const id = spec.name;
    const cache = data.resolved[id];
    if (!cache) {
      return null;
    }
    return cache;
  };
  return {
    resolve,
  };
});
