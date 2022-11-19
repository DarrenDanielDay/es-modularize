import { cjsExt, jsExt, jsonExt, mjsExt, MODULE, scopeTag, selfReference, slash } from "./constants.js";
import type { SimplifiedPathObject } from "./path.js";
import { die } from "./utils.js";

export enum ESModuleFileType {
  JSON = "json",
  Script = "script",
  Module = "module",
}

export type PackageSpec = {
  /** name */
  name: string;
  /** version specifier */
  specifier: string;
};

export const packageId = (name: string, specifier: string) => `${name}${scopeTag}${specifier}`;

export type Dependencies = { [packageName: string]: string };

export type ConditionalExports = {
  [K in "browser" | "worker" | "import" | "module" | "require" | "commonjs" | "default"]: ExportReference | undefined;
};

export type ExportDestination = string | ConditionalExports;

export type ExportReference = ExportDestination | ExportDestination[];

export type AliasMapping = Record<`./${string}` | ".", ExportReference>;

export const isAliasMapping = (exports: Exports): exports is AliasMapping =>
  exports != null && typeof exports === "object" && Object.keys(exports).every((key) => key.startsWith("."));

export type Exports =
  /** alias mapping */
  | AliasMapping
  /** isomorphic exports */
  | ExportReference;

export type StaticExportMapping = Record<
  /**
   * full package path, such as `reac-dom/client`
   */
  string,
  ScriptURL | undefined
>;

/** Static mapping does cause performance issues. Now only function is used. */
export type ExportMapping = (specifier: string) => ScriptURL | undefined;

export const accessExport = (mapping: ExportMapping, id: string) => mapping(id);

export interface PackageJSON {
  name: string;
  version: string;
  type?: "commonjs" | "module";
  main?: string;
  module?: string;
  exports?: Exports;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
}

export type PendingPackageMeta = {
  specifier: string;
  /** package.json */
  packageJSON: PackageJSON;
};

export type ResolvedDependencies = Record<string, PackageMeta>;

export type ExportAddOn = {
  /** export mapping */
  staticMapping: StaticExportMapping;
  /** export mapping */
  exportMapping: ExportMapping;
};

export type PackageMetaWithExports = PendingPackageMeta & ExportAddOn;

export type DependencyAddOn = {
  /** resolved dependencies */
  deps: ResolvedDependencies;
};

export type PackageMeta = PackageMetaWithExports & DependencyAddOn;

export type UnresolvedScriptURL = {
  /** package name */
  pkg: string;
  /** subpath */
  subpath: string;
};

export type ScriptURL = {
  /** url */
  url: string;
  /** subpath */
  subpath: string;
  /** parsed subpath */
  parsed: SimplifiedPathObject;
  /** host */
  host: PackageHost;
  /** package meta */
  packageMeta: PackageMeta;
  /** detected format by url/package meta */
  format: ESModuleFileType | null;
};

export type SourceFile = {
  /** is redirect/symbol link */
  redirected: boolean;
  /** conetnt type */
  contentType: string | null;
  /** url */
  url: ScriptURL;
  /** content */
  content: string;
};

export type ESModuleFile = SourceFile & {
  /** format */
  format: ESModuleFileType;
};

export type FS = {
  /** root path */
  root: string;
  /** read */
  read(url: ScriptURL): SourceFile | null;
  /** */
  exists(file: SourceFile | null): file is SourceFile;
};

export type PackageHost = {
  /** resolve require id */
  resolve(id: string, currentURL: ScriptURL): ESModuleFile | null;
  /** resolve package */
  resolvePackage(spec: PackageSpec): PackageMeta | null;
  /** create url */
  createURL: (pkg: PackageMeta, subpath: string, format?: ESModuleFileType | null) => ScriptURL;
  /** create anonymous url for project itself */
  createAnonymousURL: (subpath: string, deps: ResolvedDependencies, tag?: string) => ScriptURL;
};

export interface ImportMapJSON {
  imports: Record<string, string>;
}

/**
 * See [PACKAGE_RESOLVE](../docs/esm.md) in Node.JS API esm.md.
 *
 * This function just split the specifier into package name & subpath.
 *
 * @param packageSpecifier
 * @returns
 */
export const resolvePackageByName = (packageSpecifier: string): UnresolvedScriptURL => {
  // 1.
  let packageName: string | undefined = undefined;
  const invalid = () => die(`Invalid module specifier: ${packageSpecifier}`);
  // 2.
  if (packageSpecifier === "") {
    return invalid();
  }
  // 3. Will never be supported.
  // 4.
  const firstSlashIndex = packageSpecifier.indexOf(slash);
  if (!packageSpecifier.startsWith(scopeTag)) {
    packageName = packageSpecifier.slice(0, firstSlashIndex === -1 ? undefined : firstSlashIndex);
  } else {
    // 5
    if (!packageSpecifier.includes(slash)) {
      // 5.1
      return invalid();
    }
    const secondSlashIndex = packageSpecifier.indexOf(slash, firstSlashIndex + 1);
    // 5.2
    packageName = packageSpecifier.slice(0, secondSlashIndex === -1 ? undefined : secondSlashIndex);
  }
  // 6.
  if (packageName.startsWith(".") || packageName.includes("\\") || packageName.includes("%")) {
    return invalid();
  }
  // 7.
  const packageSubpath = `.${packageSpecifier.slice(packageName.length)}`;
  // 8.
  if (packageSubpath.endsWith(slash)) {
    return invalid();
  }
  return {
    pkg: packageName,
    subpath: packageSubpath || selfReference,
  };
};

export const detectFormat = (json: PackageJSON, ext: string): ESModuleFileType | null => {
  const isModule = json.type === MODULE;
  return (isModule && ext === jsExt) || ext === mjsExt
    ? ESModuleFileType.Module
    : ext === cjsExt
    ? ESModuleFileType.Script
    : ext === jsonExt
    ? ESModuleFileType.JSON
    : null;
};

export const detectDefaultFormat = (json: PackageJSON, ext: string) =>
  detectFormat(json, ext) ?? ESModuleFileType.Script;
