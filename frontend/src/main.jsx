import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MusicPlayerProvider>
      <App />
    </MusicPlayerProvider>
  </BrowserRouter>
);