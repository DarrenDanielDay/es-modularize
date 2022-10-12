/// <reference types="react" />
/// <reference types="react-dom" />
import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="./logo.svg" className="App-logo" alt="logo" />
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
