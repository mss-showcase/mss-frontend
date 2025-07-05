
import React from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useAppConfig } from './appConfig';


export function useUserPool() {
  const config = useAppConfig();
  return React.useMemo(() => new CognitoUserPool({
    UserPoolId: config.COGNITO_USER_POOL_ID,
    ClientId: config.COGNITO_CLIENT_ID,
  }), [config.COGNITO_USER_POOL_ID, config.COGNITO_CLIENT_ID]);
}
