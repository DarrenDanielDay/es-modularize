var p=Object.hasOwn;var b=console.Console;var m=JSON.parse,f=JSON.stringify;import*as o from"react";var e=o.useReducer,t=o.StrictMode;import l from"react-dom/client";import{html as n}from"htm/react";function i(){let[s,c]=e(r=>r+1,0);return n`
    <div className="App">
      <header className="App-header">
        <img src="./logo.svg" className="App-logo" alt="logo" />
        <p>
          <button onClick=${c}>Click to add count: ${s}</button>
        </p>
        <p>Edit <code>src/demo/main.tsx</code>, save ${"&"} press <kbd>F5</kbd> to reload.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer"> Learn React </a>
        <a className="App-link" href="./full-load" target="_blank"> Full load demo (very slow) </a>
      </header>
    </div>
  `}l.createRoot(document.getElementById("root")).render(n`
  <${t}>
    <${i} />
  </${t}>
`);
//# sourceMappingURL=htm-jsx.js.map
