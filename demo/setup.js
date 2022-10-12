/// <reference path="../src/index.ts" />
// @ts-check
ESModularize.createProjectLoader({
  nodeGlobals: {
    process: {
      env: {
        NODE_ENV: "production",
      },
    },
  },
})
  .load(
    {
      react: "latest",
      "react-dom": "latest",
    },
    ["react", "react-dom/client"]
  )
  .then((importMap) => {
    ESModularize.build(importMap);
  });
