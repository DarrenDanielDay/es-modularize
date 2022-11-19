// @ts-check
import * as cp from "child_process";
import path from "path";
// @ts-expect-error package self reference
import { loadStaticallyAndSaveDefaultJSON } from "es-modularize/node";
const dependencies = {
  "@angular/core": "14.2.7",
  "@angular/platform-browser-dynamic": "14.2.7",
};
await loadStaticallyAndSaveDefaultJSON("demo/angular", dependencies);

const cwd = process.cwd();
cp.fork(path.resolve(cwd, "node_modules", "ts-esmbuilder", "build.mjs"), {
  cwd: path.resolve(cwd, "demo", "angular"),
});
