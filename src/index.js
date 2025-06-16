import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import fetchWithRefresh from "./api"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
