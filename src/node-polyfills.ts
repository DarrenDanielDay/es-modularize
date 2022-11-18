import type { DeepPartial } from "./utils.js";

export const polyfillProcess = (processPatch?: DeepPartial<NodeJS.Process>): NodeJS.Process =>
  // @ts-expect-error Skipped type check because we do not create real `process` instance for browsers actually.
  processPatch ?? {
    env: {
      // `process.env.NODE_ENV` is essential to many npm packages.
      NODE_ENV: "production",
    },
  };

/**
 * Some npm package uses nodejs global variables such as `process.env`.
 * 
 * To define more globals, use TypeScript declaration merging.
 */
export interface NodePolyfills {
  /**
   * Please do not forget to provide `process.env.NODE_ENV` for most of npm packages!
   */
  process?: DeepPartial<NodeJS.Process>;
}
