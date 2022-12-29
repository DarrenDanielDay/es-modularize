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
      htm: "3.1.1",
    },
    ["react", "react-dom/client", "htm", "htm/react"]
  );
  console.log(importMap);
  ESModularize.build(importMap);
})();
