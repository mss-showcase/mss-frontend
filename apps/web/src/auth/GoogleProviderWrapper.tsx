import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export const GoogleProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};
