// @ts-check
import esbuild from "esbuild";
import { minify } from "terser";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
// @ts-expect-error package self reference
import { loadStaticallyAndSaveDefaultJSON } from "es-modularize/node";

await loadStaticallyAndSaveDefaultJSON("demo/vue", {
  vue: "^3.2.45",
});

const isDev = !process.argv.includes("--prod");
//#region react demo
const { outputFiles } = await esbuild.build({
  entryPoints: ["./demo/vue/main.ts"],
  format: "esm",
  platform: "browser",
  minify: !isDev,
  watch: isDev,
  target: "es2020",
  bundle: true,
  external: ["@vue/*", "vue"],
  outdir: "./demo/vue",
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
