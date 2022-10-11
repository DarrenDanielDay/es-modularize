/// <reference path="../index.ts" />
// @ts-check
ESModularize.createProjectLoader()
  .load(
    {
      react: "^18",
      "react-dom": "^18",
    },
    ["react", "react-dom/client"]
  )
  .then((importMap) => {
    ESModularize.build(importMap.mapping);
  });
