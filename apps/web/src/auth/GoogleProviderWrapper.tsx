import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { useAppConfig } from './appConfig';

export const GoogleProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const config = useAppConfig();
  if (!config?.GOOGLE_CLIENT_ID) return null;
  return <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
};
