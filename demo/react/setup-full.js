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
          NODE_ENV: "production",
        },
      },
    },
  }).load(
    {
      react: "latest",
      "react-dom": "latest",
      "func-di": "latest",
    }
    // Without the following parameter, all dependencies will be loaded!
    // ["react", "react-dom/client"]
  );

  ESModularize.build(fullMap);
})();
