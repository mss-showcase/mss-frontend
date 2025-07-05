let config: any = null;

export async function loadAppConfig() {
  if (!config) {
    const response = await fetch('/config.json');
    config = await response.json();
  }
  return config;
}

export function getCognitoUserPoolId() {
  return config?.COGNITO_USER_POOL_ID;
}

export function getCognitoClientId() {
  return config?.COGNITO_CLIENT_ID;
}

export function getGoogleClientId() {
  return config?.GOOGLE_CLIENT_ID;
}
