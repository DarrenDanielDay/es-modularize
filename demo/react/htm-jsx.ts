/// <reference path="./injected.d.ts" />
import ReactDOM from "react-dom/client";
import { html } from "htm/react";
import "./style.css";
function App() {
  const [count, addCount] = React.useReducer((a: number) => a + 1, 0);
  return html`
    <div className="App">
      <header className="App-header">
        <img src="./logo.svg" className="App-logo" alt="logo" />
        <p>
          <button onClick=${addCount}>Click to add count: ${count}</button>
        </p>
        <p>Edit <code>src/demo/main.tsx</code>, save ${"&"} press <kbd>F5</kbd> to reload.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer"> Learn React </a>
        <a className="App-link" href="./full-load" target="_blank"> Full load demo (very slow) </a>
      </header>
    </div>
  `;
}
ReactDOM.createRoot(document.getElementById("root")!).render(html`
  <${React.StrictMode}>
    <${App} />
  </${React.StrictMode}>
`);
