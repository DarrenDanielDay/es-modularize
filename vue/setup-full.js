/// <reference path="../../src/index.ts" />
/// <reference path="../global.d.ts" />
// @ts-check
(() => {
  const fullMap = ESModularize.createProjectLoader({
    cdnRoot,
    registry,
    nodeGlobals: {
      process: {
        env: {
          NODE_ENV: "development",
        },
      },
    },
  }).load({
    vue: "^3.2.45",
  });

  ESModularize.build(fullMap);
})();
