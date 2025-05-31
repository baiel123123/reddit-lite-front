import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import fetchWithRefresh from "./api"; // импортируем, чтобы выполнить замену fetch

// Здесь fetchWithRefresh сразу меняет window.fetch
// после этого все вызовы fetch используют твою обертку

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
