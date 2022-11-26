// @ts-check
import { exec as _exec } from "child_process";
import { resolve } from "path";
import { promisify } from "util";
const exec = promisify(_exec);
const cwd = process.cwd();
await Promise.all(
  ["angular", "react", "vue"].map(async (demo) => {
    await exec("npm install", {
      cwd: resolve(cwd, "demo", demo),
    });
  })
);
