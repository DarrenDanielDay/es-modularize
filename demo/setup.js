/// <reference path="../src/index.ts" />
// @ts-check
const importMap = ESModularize.createProjectLoader({
  nodeGlobals: {
    process: {
      env: {
        NODE_ENV: "production",
      },
    },
  },
}).load(
  {
    react: "latest",
    "react-dom": "latest",
  },
  // ["react", "react-dom/client"]
);

ESModularize.build(importMap);
