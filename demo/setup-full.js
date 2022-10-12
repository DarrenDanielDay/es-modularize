/// <reference path="../src/index.ts" />
// @ts-check
const fullMap = ESModularize.createProjectLoader({
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
  },
  // Without the following parameter, all dependencies will be loaded!
  // ["react", "react-dom/client"]
);

ESModularize.build(fullMap);
