import { inject } from "func-di";
import { rawRecursiveGenerator } from "taio/esm/libs/custom/algorithms/recursive.mjs";
import { CONTENT_JSON } from "./constants.js";
import type { Dependencies, PackageMeta } from "./core.js";
import { $config, $host, $net, $resolver } from "./deps.js";
import type { StaticRegistryData } from "./static-loader.js";
import { create } from "./utils.js";
export type ResolvedCache = Record<string, PackageMeta>;
export type PackageResolver = {
  resolveStatic(): StaticRegistryData;
  resolveAll(deps: Dependencies): ResolvedCache;
};
export const PackageResolverImpl = $resolver.implementAs(({ request }) => {
  const host = request($host);
  const config = request($config);
  const resolveAll: PackageResolver["resolveAll"] = (deps) => {
    type TryResolvedEntry = [string, PackageMeta | null];
    type ResolvedEntry = [pkg: string, meta: PackageMeta];
    const entries = Object.entries(deps).map<TryResolvedEntry>(([name, specifier]) => {
      const meta = host.resolvePackage({ name, specifier });
      return [name, meta];
    });
    const visited = create(Set<PackageMeta>);
    const flattenRecursive = rawRecursiveGenerator<[TryResolvedEntry], ResolvedEntry>(function* ([name, meta]) {
      if (!meta || visited.has(meta)) {
        return;
      }
      visited.add(meta);
      yield this.value([name, meta]);
      for (const entry of Object.entries(meta.deps)) {
        yield this.sequence(entry);
      }
    });
    const resolvedEntries = entries.flatMap((e) => [...flattenRecursive(e)]);
    return Object.fromEntries(resolvedEntries);
  };
  const resolveStatic: PackageResolver["resolveStatic"] = () => {
    const target = config.resolvedAt;
    const response = request($net).read(target);
    if (!response) {
      throw new Error(`Data file ${target} not found.`);
    }
    const { content, contentType } = response;
    if (!contentType?.includes(CONTENT_JSON) || typeof content !== "string") {
      throw new Error(`Invalid content type, expecting JSON`);
    }
    const staticData: StaticRegistryData = JSON.parse(content);
    return staticData;
  };
  return {
    resolveAll,
    resolveStatic,
  };
});
