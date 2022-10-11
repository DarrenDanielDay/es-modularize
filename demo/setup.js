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
      react: "^18",
      "react-dom": "^18",
    },
    ["react", "react-dom/client"]
  )
  .then((importMap) => {
    ESModularize.build(importMap);
  });
