import React from "react";
import ReactDOM from "react-dom/client";

const element = React.createElement(
  "div",
  {
    style: {
      color: "red",
      fontSize: 100,
    },
  },
  "Hello, React!"
);
const container = document.querySelector("#app");
ReactDOM.createRoot(container).render(element);
