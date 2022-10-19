// @ts-check
import esbuild from "esbuild";
import { minify } from "terser";
import { simplifyGlobalAPI } from "esbuild-plugin-global-api";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";
const isDev = !process.argv.includes("--prod");
const isForDemo = process.argv.includes("--demo");
const outfile = isDev || isForDemo ? "./demo/index.js" : "./dist/browser.bundle.min.js";
await esbuild.build({
  entryPoints: ["./src/index.ts"],
  format: "iife",
  platform: "browser",
  minify: !isDev,
  watch: isDev,
  target: "es2020",
  bundle: true,
  outfile,
  sourcemap: true,
  plugins: [simplifyGlobalAPI()],
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
