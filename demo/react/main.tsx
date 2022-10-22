/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference path="./injected.d.ts" />
/// <reference path="../global.d.ts" />
import ReactDOM from "react-dom/client";
import { inject } from "func-di";
import "./style.css";
globalThis.__ESM_LOADED__ = true;
console.log(inject);
function App() {
  const [count, addCount] = React.useReducer((a: number) => a + 1, 0);
  return (
    <div className="App">
      <header className="App-header">
        <img src="./logo.svg" className="App-logo" alt="logo" />
        <p>
          <button onClick={addCount}>Click to add count: {count}</button>
        </p>
        <p>
          Edit <code>src/demo/main.tsx</code>, save {"&"} press <kbd>F5</kbd> to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="App-link" href="./full-load" target="_blank">
          Full load demo (very slow)
        </a>
      </header>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
