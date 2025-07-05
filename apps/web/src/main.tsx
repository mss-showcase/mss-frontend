import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@mss-frontend/store';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './theme/theme.css';
import * as buffer from 'buffer';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Polyfill Buffer for amazon-cognito-identity-js
import('buffer').then(buffer => {
  window.Buffer = buffer.Buffer;
});

function ConfiguredApp() {
  const [clientId, setClientId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/config.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load config.json');
        return res.json();
      })
      .then(cfg => {
        if (!cfg.GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID in config.json');
        setClientId(cfg.GOOGLE_CLIENT_ID);
      })
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, margin: 32, textAlign: 'center' }}>Config error: {error}</div>;
  if (!clientId) return <div style={{ color: '#888', padding: 32, textAlign: 'center' }}>Loading configuration...</div>;

  return (
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<ConfiguredApp />);