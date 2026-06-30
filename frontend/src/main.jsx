import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={publishableKey}>
    <BrowserRouter>
      <MusicPlayerProvider>
        <App />
      </MusicPlayerProvider>
    </BrowserRouter>
  </ClerkProvider>
);