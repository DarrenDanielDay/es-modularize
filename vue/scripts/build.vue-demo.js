// @ts-check
import esbuild from "esbuild";
import { minify } from "terser";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
import { loadStaticallyAndSaveDefaultJSON } from "../../../dist/static-loader.js";

await loadStaticallyAndSaveDefaultJSON(
  ".",
  {
    vue: "^3.2.45",
  },
  [
    "vue",
    "@vue/compiler-core",
    "@vue/compiler-dom",
    "@vue/runtime-dom",
    "@vue/runtime-core",
    "@vue/shared",
    "@vue/reactivity",
  ]
);

const isDev = !process.argv.includes("--prod");
//#region react demo
const { outputFiles } = await esbuild.build({
  entryPoints: ["./main.ts"],
  format: "esm",
  platform: "browser",
  minify: !isDev,
  watch: isDev,
  target: "es2020",
  bundle: true,
  external: ["@vue/*", "vue"],
  outdir: ".",
  sourcemap: true,
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
