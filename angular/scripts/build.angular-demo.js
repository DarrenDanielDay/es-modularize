// @ts-check
import * as cp from "child_process";
import path from "path";
import { loadStaticallyAndSaveDefaultJSON } from "../../../dist/static-loader.js";

const dependencies = {
  "@angular/core": "14.2.7",
  "@angular/platform-browser-dynamic": "14.2.7",
};
await loadStaticallyAndSaveDefaultJSON(".", dependencies);

const cwd = process.cwd();
cp.fork(path.resolve(cwd, "node_modules", "ts-esmbuilder", "build.mjs"));
