import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

/* apply theme based on system preference and listen for changes */
(function initSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = (isDark) => {
    if (isDark) document.documentElement.classList.add("theme-dark");
    else document.documentElement.classList.remove("theme-dark");
  };
  apply(mq.matches);
  const handler = (e) => apply(e.matches);
  if (mq.addEventListener) mq.addEventListener("change", handler);
  else mq.addListener(handler);
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
