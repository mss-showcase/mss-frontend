// Hardcoded config values (no config.json needed)
export const APP_CONFIG = {
  LOCAL_GATEWAY_URL: "https://yax9kdvw03.execute-api.eu-north-1.amazonaws.com",
  COGNITO_USER_POOL_ID: "eu-north-1_206FbYGTb",
  COGNITO_CLIENT_ID: "443dvv35a6jon56vbrm99pdqd2",
  GOOGLE_CLIENT_ID: "413905055004-ev8bd9r4begbuq1ud694jq0s31p1979e.apps.googleusercontent.com",
  COGNITO_DOMAIN: "https://mss-showcase.auth.eu-north-1.amazoncognito.com"
};
export function getCognitoDomain() {
  return APP_CONFIG.COGNITO_DOMAIN;
}

export function useAppConfig() {
  return APP_CONFIG;
}

export function getCognitoUserPoolId() {
  return APP_CONFIG.COGNITO_USER_POOL_ID;
}

export function getCognitoClientId() {
  return APP_CONFIG.COGNITO_CLIENT_ID;
}

export function getGoogleClientId() {
  return APP_CONFIG.GOOGLE_CLIENT_ID;
}
