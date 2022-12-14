// @ts-check
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

// Without bundler like webpack, need to replace <base href="PUBLIC_URL">
const PUBLIC_URL = process.env.PUBLIC_URL ?? "";
const kinds = ["angular", "react", "vue"];
const files = ["index.html", "full-load.html"];
// General examples can be generated by concat rule.
const targets = kinds.flatMap((k) => files.flatMap((f) => demoPath(k, f)));
// Special HTMLs/example HTML here.
targets.push(demoPath("index.html"), demoPath("not-supported.html"), demoPath("react", "htm-jsx.html"));
for (const target of targets) {
  const html = await readFile(target, { encoding: "utf-8" });
  await writeFile(
    target,
    html.replace(/(?<=base href=")([^"]*)/g, (_, subPath) => `${PUBLIC_URL}${subPath}`)
  );
}
/**
 * @param  {string[]} fragments path fragments
 */
function demoPath(...fragments) {
  return join(process.cwd(), "demo", ...fragments);
}
