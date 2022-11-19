// @ts-check
import { readFile, writeFile } from "fs/promises";
console.log("post install: remove vue jsx");
const file = "./node_modules/@vue/runtime-dom/dist/runtime-dom.d.ts";
const content = await readFile(file, { encoding: "utf-8" });
const noJSX = content
  .split(/\r?\n/g)
  .filter((_, line) => !(1493 <= line && line <= 1509))
  .join("\n");
await writeFile(file, noJSX);
