import type path from "path-browserify";
import { scopeTag, selfReference, slash } from "./constants";
import { die, Perform } from "./utils";

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

export type Dependencies = Record<string, string>;

export type PlatformExportPath = Record<
  "deno" | "browser" | "worker" | "node" | "default" | "import" | "require",
  `./${string}` | undefined
>;

export type ExportReference = string | PlatformExportPath;

export type Exports =
  /** single main export */
  | string
  /** alias mapping */
  | Record<`./${string}` | ".", ExportReference>
  /** isomorphic exports */
  | Array<ExportReference>;

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
  exports?: Exports;
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
}

export type PendingPackageMeta = {
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
  parsed: path.PathObject;
  /** host */
  host: PackageHost;
  /** package meta */
  packageMeta: PackageMeta;
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
  /** sync */
  sync: boolean;
  /** read */
  read: Perform<[url: ScriptURL], SourceFile | null>;
};

export type PackageHost = {
  /** resolve require id */
  resolve: Perform<[id: string, currentURL: ScriptURL], ESModuleFile | null>;
  /** resolve package */
  resolvePackage: Perform<[spec: PackageSpec], PackageMeta | null>;
  /** create url */
  createURL: (pkg: PackageMeta, subpath: string) => ScriptURL;
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
