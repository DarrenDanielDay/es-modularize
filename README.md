# es-modularize

[![Publish CI](https://github.com/DarrenDanielDay/es-modularize/actions/workflows/publish.yml/badge.svg)](https://github.com/DarrenDanielDay/func-di/actions/) [![npm version](https://badge.fury.io/js/es-modularize.svg)](https://badge.fury.io/js/func-di)

A browser only tool for converting npm package to ES module.

This library allows the following code to work correctly in browser thanks to a modern feature `<script type="importmap">`.

```js
// entry.js
import React from "react";
import ReactDOM from "react-dom";
```

Currently only `UMD` packages are supported. For browser import map support, you might need this tool:

<https://github.com/guybedford/es-module-shims>

## Example

Synchronous example:

```html
<!-- include this library -->
<script src="https://unpkg.com/es-modularize"></script>
<!-- define import maps -->
<script>
  ESModularize.build({
    react: ESModularize.load("https://unpkg.com/react@latest/umd/react.development.js").sync().umd("React"),
    "react-dom": ESModularize.load("https://unpkg.com/react-dom@latest/umd/react-dom.development.js")
      .sync()
      .umd("ReactDOM"),
  });
</script>
<!-- now module imports can work -->
<script type="module" src="entry.js"></script>
```

Asynchronous example:

```html
<!-- include this library -->
<script src="https://unpkg.com/es-modularize"></script>
<!-- define import maps -->
<script>
  (async () => {
    ESModularize.build({
      react: (await ESModularize.load("https://unpkg.com/react@latest/umd/react.development.js").async()).umd("React"),
      "react-dom": (
        await ESModularize.load("https://unpkg.com/react-dom@latest/umd/react-dom.development.js").async()
      ).umd("ReactDOM"),
    });
    // now module imports can work, but script elements should be created asynchronously.
    document.body.appendChild(Object.assign(document.createElement("script"), { type: "module", src: "entry.js" }));
  })();
</script>
```

## License

```text
 __________________
< The MIT license! >
 ------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
