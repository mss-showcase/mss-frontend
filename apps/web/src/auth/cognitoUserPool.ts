import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { loadAppConfig, getCognitoUserPoolId, getCognitoClientId } from './appConfig';

let userPool: CognitoUserPool | null = null;

export async function getUserPool() {
  if (!userPool) {
    await loadAppConfig();
    userPool = new CognitoUserPool({
      UserPoolId: getCognitoUserPoolId(),
      ClientId: getCognitoClientId(),
    });
  }
  return userPool;
}
