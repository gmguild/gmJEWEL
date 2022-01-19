import "./main.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

const e = React.createElement;

if (window.ethereum?.on) {
  window.ethereum.on("accountsChanged", function () {
    location.reload();
  });
}

ReactDOM.render(
  e(React.StrictMode, {}, e(App)),
  document.querySelector("#app")
);
