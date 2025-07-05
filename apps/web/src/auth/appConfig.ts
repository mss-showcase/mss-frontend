import React from 'react';
import { ConfigContext } from '../main';

export function useAppConfig() {
  const config = React.useContext(ConfigContext);
  if (!config) throw new Error('ConfigContext not found!');
  return config;
}

export function getCognitoUserPoolId() {
  return React.useContext(ConfigContext)?.COGNITO_USER_POOL_ID;
}

export function getCognitoClientId() {
  return React.useContext(ConfigContext)?.COGNITO_CLIENT_ID;
}

export function getGoogleClientId() {
  return React.useContext(ConfigContext)?.GOOGLE_CLIENT_ID;
}
