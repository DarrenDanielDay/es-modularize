import { selfReference, slash } from "./constants.js";
import { trimSlash } from "./utils.js";

/**
 * Simplified join logic.
 * @param base base
 * @param subPath subpath
 */
export const join = (base: string, subPath: string) => {
  if (!base) base = ".";
  const fragments = base.split(slash);
  const commands = subPath.split(slash);
  for (const command of commands) {
    if (command === "." || !command) {
      continue;
    }
    if (command === "..") {
      fragments.pop();
      continue;
    }
    fragments.push(command);
  }
  return fragments.join(slash);
};

export interface SimplifiedPathObject {
  base: string;
  dir: string;
  ext: string;
}
/**
 * Simplified parse path logic.
 * @param url full path
 * @returns path object with only attrs used
 */
export const parse = (url: string): SimplifiedPathObject => {
  const lastValidIndex = url.endsWith(slash) ? url.length - 1 : url.length;
  const lastSlashIndex = url.lastIndexOf(slash, lastValidIndex - 1);
  const lastIndexOfDot = url.lastIndexOf(selfReference, lastValidIndex - 1);
  if (!~lastSlashIndex) {
    return {
      base: url,
      dir: "",
      ext: ~lastIndexOfDot ? url.slice(lastIndexOfDot) : "",
    };
  } else {
    return {
      dir: url.slice(0, lastSlashIndex),
      base: url.slice(lastSlashIndex + 1, lastValidIndex),
      ext: ~lastIndexOfDot ? url.slice(lastIndexOfDot, lastValidIndex) : "",
    };
  }
};
