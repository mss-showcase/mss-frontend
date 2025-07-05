import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@mss-frontend/store';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './theme/theme.css';
import * as buffer from 'buffer';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Load config.json for Google Client ID
async function getConfig() {
  const response = await fetch('/config.json');
  return response.json();
}


// Polyfill Buffer for amazon-cognito-identity-js
import('buffer').then(buffer => {
  window.Buffer = buffer.Buffer;
});

getConfig().then(config => {
  const clientId = config.GOOGLE_CLIENT_ID;
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  );
});

// ...existing code...