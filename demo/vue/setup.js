/// <reference path="../../src/index.ts" />
/// <reference path="../global.d.ts" />
// @ts-check
(() => {
  const loader = ESModularize.createStaticProjectLoader({
    cdnRoot,
    registry,
    nodeGlobals: {
      process: {
        env: {
          NODE_ENV: "production",
        },
      },
    },
  });
  const importMap = loader.loadResolved();
  console.log(importMap);
  ESModularize.build(importMap);
})();
