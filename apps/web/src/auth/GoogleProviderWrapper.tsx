import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

import { useEffect, useState } from 'react';
import { loadAppConfig, getGoogleClientId } from './appConfig';

export const GoogleProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    loadAppConfig().then(() => {
      setClientId(getGoogleClientId());
    });
  }, []);

  if (!clientId) return null;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};
