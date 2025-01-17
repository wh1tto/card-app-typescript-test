import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { DarkModeProvider } from "./utilities/darkmodeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);
