// Hardcoded gateway URL (no config.json needed)
const DEFAULT_LOCAL_GATEWAY_URL = 'https://8vceo9xnpj.execute-api.eu-north-1.amazonaws.com';
const ENV_GATEWAY_URL = (import.meta as any).env?.VITE_GATEWAY_URL;

export async function loadConfig() {
  // No-op, kept for compatibility
  return { LOCAL_GATEWAY_URL: getGatewayUrl() };
}

export function getGatewayUrl() {
  return ENV_GATEWAY_URL || DEFAULT_LOCAL_GATEWAY_URL;
}