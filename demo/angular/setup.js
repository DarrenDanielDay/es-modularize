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
  ESModularize.build({
    imports: {
      ...importMap.imports,
      // special setup for rxjs
      rxjs: `${cdnRoot}/rxjs@7.5.7/dist/esm/index.js`,
      "rxjs/operators": `${cdnRoot}/rxjs@7.5.7/dist/esm/operators/index.js`,
    },
  });
})();
