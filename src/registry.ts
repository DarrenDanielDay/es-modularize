import type { PackageJSON, PackageSpec } from "./core";
import type { NetReader } from "./net";
import { die, getStringTag, trimSlash } from "./utils";
import { maxSatisfying, SemVer } from "semver";
import { latest } from "./constants";
export type PackageRegistry = {
  /** resolve */
  resolve(spec: PackageSpec): PackageJSON | null;
};
export const createPackageRegistry = (net: NetReader, registry = "https://registry.npmjs.org"): PackageRegistry => {
  registry = trimSlash(registry);
  const resolveCache: Record<string, PackageJSON> = {};
  const resolve: PackageRegistry["resolve"] = ({ name, specifier }) => {
    let isExact = specifier === latest;
    if (!isExact) {
      try {
        new SemVer(specifier);
        isExact = true;
      } catch {
        // noop
      }
    }
    const target = isExact ? `${name}/${specifier}` : name;
    const url = `${registry}/${target}`;
    const resolved = resolveCache[url];
    if (resolved) {
      return resolved;
    }
    const resolveAs = (packageJSON: PackageJSON) => {
      resolveCache[url] = packageJSON;
      return packageJSON;
    };
    const response = net.read(url);
    const content = response?.content;
    if (typeof content !== "string") {
      return die(`Invalid registry response content, got ${getStringTag(content)}`);
    }
    try {
      let data = JSON.parse(content);
      if (isExact) {
        // Skip package.json checkes
        return resolveAs(data);
      }
      if (data.error) {
        return die(`The registry server responded an error: ${JSON.stringify(data.error)}`);
      }
      // Part of `package-json`.
      //#region https://github.com/sindresorhus/package-json/blob/main/index.js#L85
      /**
       * @license package-json
       *
       * MIT License
       *
       * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
       * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
       * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
       * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
       */
      let version: string | null = specifier;
      if (data["dist-tags"][version]) {
        data = data.versions[data["dist-tags"][version]];
      } else if (version) {
        if (!data.versions[version]) {
          const versions = Object.keys(data.versions);
          version = maxSatisfying(versions, version);
          if (!version) {
            return die(`Cannot find version satisfying ${specifier}. Available versions are: ${versions.join(", ")}.`);
          }
        }
        data = data.versions[version];
        if (!data) {
          return die(`Cannot find version info of ${version} in registry versions.`);
        }
      }
      // Skip package.json checkes
      return resolveAs(data);
      //#endregion
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  return {
    resolve,
  };
};
