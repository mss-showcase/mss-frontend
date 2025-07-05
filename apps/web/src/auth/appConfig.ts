// Hardcoded config values (no config.json needed)
export const APP_CONFIG = {
  LOCAL_GATEWAY_URL: "https://8vceo9xnpj.execute-api.eu-north-1.amazonaws.com",
  COGNITO_USER_POOL_ID: "eu-north-1_pY9zOeu2e",
  COGNITO_CLIENT_ID: "6tc22v51cp6nafrrjfq3ugthb7",
  GOOGLE_CLIENT_ID: "413905055004-ev8bd9r4begbuq1ud694jq0s31p1979e.apps.googleusercontent.com"
};

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
