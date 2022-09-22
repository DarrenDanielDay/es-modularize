const ESModularize = {
  load(path: string) {
    const umd = (globalNamespace: string) => {
      const globalObject = Reflect.get(globalThis, globalNamespace);
      if (!globalObject || typeof globalObject !== "object") {
        return null;
      }

      const exportNames = Object.keys(globalObject).join(",");
      const code = `const{${exportNames}}=globalThis["${globalNamespace}"];export{${exportNames}};export default globalThis["${globalNamespace}"];`;
      return URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
    };
    return {
      sync() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.send();
        (0, eval)(xhr.response);
        return {
          umd,
        };
      },
      async async() {
        const s = document.createElement("script");
        s.src = path;
        document.body.appendChild(s);
        await new Promise<void>((resolve) => {
          const handler = () => {
            s.removeEventListener("load", handler);
            resolve();
          };
          s.addEventListener("load", handler);
        });
        return {
          umd,
        };
      },
    };
  },
  build(mapping: Record<string, string | null>) {
    const importmap = document.createElement("script");
    importmap.type = "importmap";
    importmap.textContent = JSON.stringify({
      imports: mapping,
    });
    const firstScript = document.currentScript || document.querySelector("script");
    if (firstScript) {
      firstScript.after(importmap);
    } else {
      document.body.appendChild(importmap);
    }
  },
};
Object.assign(globalThis, { ESModularize });
