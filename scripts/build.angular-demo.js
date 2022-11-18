// @ts-check
import * as cp from "child_process";
import path from "path";
// @ts-expect-error package self reference
import { loadStaticallyAndSaveDefaultJSON } from "es-modularize/node";
const dependencies = {
  "@angular/common": "14.2.7",
  "@angular/compiler": "14.2.7",
  "@angular/core": "14.2.7",
  "@angular/platform-browser": "14.2.7",
  "@angular/platform-browser-dynamic": "14.2.7",
  tslib: "2.4.0",
};
await loadStaticallyAndSaveDefaultJSON("demo/angular", dependencies, Object.keys(dependencies));

const cwd = process.cwd();
cp.fork(path.resolve(cwd, "node_modules", "ts-esmbuilder", "build.mjs"), {
  cwd: path.resolve(cwd, "demo", "angular"),
});
