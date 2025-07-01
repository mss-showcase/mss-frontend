let config: { LOCAL_GATEWAY_URL: string } | null = null;

// default url for local development
const DEFAULT_LOCAL_GATEWAY_URL = 'https://8vceo9xnpj.execute-api.eu-north-1.amazonaws.com';
// the current url must be placed into this file that should be deployed 
// next to the compiled app
const CONFIG_URL = '/config.json';

// Check for environment variable override (for local development)
const ENV_GATEWAY_URL = (import.meta as any).env?.VITE_GATEWAY_URL; 

export async function loadConfig() {
  if (!config) {
    // First check for environment variable override
    if (ENV_GATEWAY_URL) {
      config = { LOCAL_GATEWAY_URL: ENV_GATEWAY_URL };
      return config;
    }
    
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
  // Check environment variable first
  if (ENV_GATEWAY_URL) return ENV_GATEWAY_URL;
  
  if (!config) return DEFAULT_LOCAL_GATEWAY_URL;
  return config.LOCAL_GATEWAY_URL || DEFAULT_LOCAL_GATEWAY_URL;
}