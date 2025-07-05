import { CognitoUserPool } from 'amazon-cognito-identity-js';


const poolData = {
  UserPoolId: (import.meta as any).env.VITE_COGNITO_USER_POOL_ID,
  ClientId: (import.meta as any).env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export default userPool;
