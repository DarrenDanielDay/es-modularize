// @ts-check
import esbuild from "esbuild";
import { minify } from "terser";
import { simplifyGlobalAPI, defaultApplyTo } from "esbuild-plugin-global-api";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
// @ts-expect-error package self reference
import { loadStaticallyAndSaveDefaultJSON } from "es-modularize/node";

await loadStaticallyAndSaveDefaultJSON(
  "demo/react",
  {
    react: "latest",
    "react-dom": "latest",
    "func-di": "latest",
  },
  ["react", "react-dom/client", "func-di"]
);

const isDev = !process.argv.includes("--prod");
//#region react demo
const { outputFiles } = await esbuild.build({
  entryPoints: ["./demo/react/main.tsx", "./demo/react/htm-jsx.ts"],
  format: "esm",
  platform: "browser",
  minify: !isDev,
  watch: isDev,
  target: "es2020",
  bundle: true,
  external: ["react", "react-dom", "htm", "func-di"],
  outdir: "./demo/react",
  sourcemap: true,
  plugins: [
    simplifyGlobalAPI({
      lib: {
        React: {
          code: 'import * as React from "react";',
          rule: {
            type: "object",
            members: {
              createElement: "func",
              useReducer: "func",
              StrictMode: "constant",
            },
          },
          applyTo: defaultApplyTo,
        },
      },
    }),
  ],
});

/**
 *
 * @param {string} outfile
 */
const minifyByTerser = async (outfile) => {
  const distFile = resolve(outfile);
  const { code } = await minify(await readFile(distFile, { encoding: "utf-8" }), {
    compress: true,
    format: {
      ecma: 2020,
    },
    ecma: 2020,
  });
  if (!code) {
    throw new Error("Terser minify failed.");
  }
  await writeFile(distFile, code);
};
for (const file of outputFiles ?? []) {
  await minifyByTerser(file.path);
}
//#endregion
