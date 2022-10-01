/// <reference path="../index.ts" />
ESModularize.build({
  react: ESModularize.load("https://unpkg.com/react@latest/umd/react.development.js").sync().umd("React"),
});


