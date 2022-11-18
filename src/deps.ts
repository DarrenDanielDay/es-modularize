import { token } from "func-di";
import type { FS, PackageHost } from "./core.js";
import type { NetReader } from "./net.js";
import type { ProjectLoader, ProjectLoaderConfig } from "./project-loader.js";
import type { PackageRegistry } from "./registry.js";
import type { PackageResolver } from "./resolver.js";
export const $fs = token<FS>("fs");
export const $net = token<NetReader>("net");
export const $registry = token<PackageRegistry>("registry");
export const $host = token<PackageHost>("host");
export const $projectLoader = token<ProjectLoader>("project-loader");
export const $config = token<Required<ProjectLoaderConfig>>("config");
export const $resolver = token<PackageResolver>('resolver')