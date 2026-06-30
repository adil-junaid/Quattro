import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './app';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

if (PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  console.warn("Clerk Publishable Key is missing. Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your .env file.");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
