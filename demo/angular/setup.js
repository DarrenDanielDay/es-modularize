/// <reference path="../../src/index.ts" />
/// <reference path="../global.d.ts" />

(() => {
  const importMap = ESModularize.createStaticProjectLoader({
    cdnRoot,
    registry,
    nodeGlobals: {
      process: {
        env: {
          NODE_ENV: "production",
        },
      },
    },
  }).loadResolved();
  console.log(importMap);
  ESModularize.build(importMap);
})();
