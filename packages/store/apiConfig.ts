let config: { LOCAL_GATEWAY_URL: string } | null = null;

// default url for local development
const DEFAULT_LOCAL_GATEWAY_URL = 'https://8vceo9xnpj.execute-api.eu-north-1.amazonaws.com';
// the current url must be placed into this file that should be deployed 
// next to the compiled app
const CONFIG_URL = '/config.json'; 

export async function loadConfig() {
  if (!config) {
    try {
      const response = await fetch(CONFIG_URL);
      if (!response.ok) throw new Error('Config fetch failed');
      config = await response.json();
    } catch {
      // Fallback to default for local dev
      config = { LOCAL_GATEWAY_URL: DEFAULT_LOCAL_GATEWAY_URL };
    }
  }
  return config;
}

export function getGatewayUrl() {
  if (!config) return DEFAULT_LOCAL_GATEWAY_URL;
  return config.LOCAL_GATEWAY_URL || DEFAULT_LOCAL_GATEWAY_URL;
}