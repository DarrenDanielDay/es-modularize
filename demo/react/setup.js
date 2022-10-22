/// <reference path="../../src/index.ts" />
/// <reference path="../global.d.ts" />
// @ts-check
(() => {
  const importMap = ESModularize.createProjectLoader({
    cdnRoot,
    registry,
    nodeGlobals: {
      process: {
        env: {
          NODE_ENV: "production",
        },
      },
    },
  }).load(
    {
      react: "18.2.0",
      "react-dom": "18.2.0",
      "func-di": "1.4.2",
    },
    ["react", "react-dom/client", "func-di"]
  );
  console.log(importMap);
  ESModularize.build(importMap);
})();
