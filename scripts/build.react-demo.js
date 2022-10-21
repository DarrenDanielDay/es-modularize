// @ts-check
import esbuild from "esbuild";
import { minify } from "terser";
import { simplifyGlobalAPI, defaultApplyTo } from "esbuild-plugin-global-api";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
const isDev = !process.argv.includes("--prod");
//#region react demo
const outfile = "./demo/react/main.js";
await esbuild.build({
  entryPoints: ["./demo/react/main.tsx"],
  format: "esm",
  platform: "browser",
  minify: !isDev,
  watch: isDev,
  target: "es2020",
  bundle: true,
  external: ["react", "react-dom", "func-di"],
  outfile,
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
              useReducer: 'func',
              StrictMode: "constant",
            },
          },
          applyTo: defaultApplyTo,
        },
      },
    }),
  ],
});

if (!isDev) {
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
}
//#endregion
