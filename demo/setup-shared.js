var { cdnRoot, registry } = (() => {
  const params = new URL(location.href).searchParams;
  const cdnRoot = decodeURIComponent(params.get("cdn") ?? "") || "https://unpkg.com";
  const registry = decodeURIComponent(params.get("registry") ?? "") || "https://registry.npmjs.org";
  return { cdnRoot, registry };
})();
Object.assign(globalThis, { cdnRoot, registry });
