import type { PackageJSON, PackageSpec } from "./core";
import type { NetReader } from "./net";
import { Perform, performAs, trimSlash } from "./utils";
import { maxSatisfying, SemVer } from "semver";
import { latest } from "./constants";
export type PackageRegistry = {
  /** resolve */
  resolve: Perform<[spec: PackageSpec], PackageJSON | null>;
};
export const createPackageRegistry = (net: NetReader, registry = "https://registry.npmjs.org"): PackageRegistry => {
  registry = trimSlash(registry);
  const resolve: PackageRegistry["resolve"] = performAs((resume, { name, specifier }) => {
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
    net.read(`${registry}/${target}`).then((response) => {
      const content = response?.content;
      if (typeof content !== "string") {
        return resume(null);
      }
      try {
        let data = JSON.parse(content);
        if (isExact) {
          // Skip package.json checkes
          return resume(data);
        }
        if (!data || data.error) {
          return resume(null);
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
              return resume(null);
            }
          }
          data = data.versions[version];
          if (!data) {
            return resume(null);
          }
          // Skip package.json checkes
          return resume(data);
        }
        //#endregion
      } catch (error) {
        console.error(error);
        return resume(null);
      }
    });
  });
  return {
    resolve,
  };
};
