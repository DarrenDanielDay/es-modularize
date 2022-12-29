/// <reference path="../../src/index.ts" />
/// <reference path="../global.d.ts" />
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
  }).load({
    "@angular/core": "14.2.7",
    "@angular/platform-browser-dynamic": "14.2.7",
  });
  console.log(importMap);
  ESModularize.build(importMap);
})();
