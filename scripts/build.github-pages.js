import { readFile, writeFile } from "fs/promises";
import { join } from "path";

// Without bundler like webpack, need to replace <base href="PUBLIC_URL">
const PUBLIC_URL = process.env.PUBLIC_URL ?? "";
const kinds = ["angular", "react"];
const files = ["index.html", "full-load.html"];
const targets = kinds.flatMap((k) => files.flatMap((f) => join(process.cwd(), "demo", k, f)));
for (const target of targets) {
  const html = await readFile(target, { encoding: "utf-8" });
  await writeFile(
    target,
    html.replace(/(?<=base href=")([^"]*)/g, (_, subPath) => `${PUBLIC_URL}${subPath}`)
  );
}
