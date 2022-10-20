import * as cp from "child_process";
import path from "path";

const cwd = process.cwd();
cp.fork(path.resolve(cwd, "node_modules", "ts-esmbuilder", "build.mjs"), {
  cwd: path.resolve(cwd, "demo", "angular"),
});
