/// <reference path="../../src/index.ts" />
/// <reference path="../setup-shared.js" />

(() => {
  const dependencies = {
    "@angular/common": "14.2.7",
    "@angular/compiler": "14.2.7",
    "@angular/core": "14.2.7",
    "@angular/platform-browser": "14.2.7",
    "@angular/platform-browser-dynamic": "14.2.7",
    tslib: "2.4.0",
  };
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
  }).load(dependencies, Object.keys(dependencies));
  ESModularize.build({
    imports: {
      ...importMap.imports,
      // special setup for rxjs
      rxjs: `${cdnRoot}/rxjs@7.5.7/dist/esm/index.js`,
      "rxjs/operators": `${cdnRoot}/rxjs@7.5.7/dist/esm/operators/index.js`,
    },
  });
})();
