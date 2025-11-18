import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';

// Use the correct publishable key
const PUBLISHABLE_KEY = "pk_test_bW9yZS1jcmF5ZmlzaC0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

// Create root and render app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
      routing="path"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      afterSignOutUrl="/dashboard"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
