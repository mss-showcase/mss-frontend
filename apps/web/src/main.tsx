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



import { APP_CONFIG } from './auth/appConfig';

function MainApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={APP_CONFIG.GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<MainApp />);