import { useWeather } from './useWeather';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  
  header: {
    textAlign: 'center' as const,
  } as React.CSSProperties,
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: 0,
  } as React.CSSProperties,
  
  contentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,
  
  loadingState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#6b7280',
    gap: '1rem',
  } as React.CSSProperties,
  
  errorState: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  } as React.CSSProperties,
  
  weatherMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '1.5rem 0',
  } as React.CSSProperties,
  
  weatherIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e0e7ff, #f0f0f0)',
    padding: '8px',
  } as React.CSSProperties,
  
  weatherDetails: {
    flex: 1,
  } as React.CSSProperties,
  
  weatherTemp: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    margin: 0,
    lineHeight: 1,
  } as React.CSSProperties,
  
  weatherDescription: {
    fontSize: '1.2rem',
    color: '#555',
    margin: '0.5rem 0',
    textTransform: 'capitalize' as const,
  } as React.CSSProperties,
  
  weatherFeelsLike: {
    fontSize: '1rem',
    color: '#888',
  } as React.CSSProperties,
  
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  } as React.CSSProperties,
  
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  metricIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  } as React.CSSProperties,
  
  metricContent: {
    flex: 1,
  } as React.CSSProperties,
  
  metricLabel: {
    fontSize: '0.75rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  
  metricValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  } as React.CSSProperties,
  
  contextNote: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f0f8ff',
    border: '1px solid #cce7ff',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#666',
  } as React.CSSProperties,
  
  descriptionText: {
    lineHeight: '1.6',
    color: '#555',
    margin: 0,
  } as React.CSSProperties,
};

export default function WeatherFeedReader() {
  const { weather, loading, error } = useWeather();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🌤️ Weather Information</h1>
        <p style={styles.subtitle}>
          Current weather conditions to help contextualize market activity
        </p>
      </div>

      <div className="content-cards">
        {loading && (
          <div className="card">
            <div className="card-content">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading weather information...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="card error-card">
            <div className="card-content">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <div>
                  <h3>Weather Data Unavailable</h3>
                  <p>{error}</p>
                  <p className="error-help">
                    Unable to retrieve current weather conditions. Please check your connection or try again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && weather && (
          <>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Current Conditions</h2>
                <div className="card-subtitle">
                  {weather.name}
                </div>
              </div>
              <div className="card-content">
                <div className="weather-main">
                  <div className="weather-icon-section">
                    <img
                      src={weather.weather[0].icon}
                      alt={weather.weather[0].description}
                      className="weather-icon"
                    />
                  </div>
                  <div className="weather-details">
                    <div className="weather-temp">
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div className="weather-description">
                      {weather.weather[0].description.charAt(0).toUpperCase() + 
                       weather.weather[0].description.slice(1)}
                    </div>
                    <div className="weather-feels-like">
                      Feels like {Math.round(weather.main.feels_like)}°C
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Detailed Metrics</h2>
              </div>
              <div className="card-content">
                <div className="weather-metrics">
                  <div className="metric-item">
                    <div className="metric-icon">💧</div>
                    <div className="metric-content">
                      <div className="metric-label">Humidity</div>
                      <div className="metric-value">{Math.round(weather.main.humidity)}%</div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">🌡️</div>
                    <div className="metric-content">
                      <div className="metric-label">Temperature</div>
                      <div className="metric-value">{Math.round(weather.main.temp)}°C</div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">🌡️</div>
                    <div className="metric-content">
                      <div className="metric-label">Feels Like</div>
                      <div className="metric-value">{Math.round(weather.main.feels_like)}°C</div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">�</div>
                    <div className="metric-content">
                      <div className="metric-label">Location</div>
                      <div className="metric-value">{weather.name}</div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-icon">☁️</div>
                    <div className="metric-content">
                      <div className="metric-label">Conditions</div>
                      <div className="metric-value">{weather.weather[0].description}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Market Context</h2>
              </div>
              <div className="card-content">
                <div className="weather-context">
                  <p className="description-text">
                    Weather conditions can influence market sentiment and certain sectors. 
                    {weather.weather[0].description.toLowerCase().includes('rain') && 
                      " Rainy weather might impact outdoor retail and entertainment sectors."}
                    {weather.weather[0].description.toLowerCase().includes('clear') && 
                      " Clear weather typically supports outdoor business activities."}
                    {weather.weather[0].description.toLowerCase().includes('sun') && 
                      " Sunny weather may boost outdoor recreation and tourism sectors."}
                    {weather.main.temp > 25 && 
                      " High temperatures may benefit cooling and beverage companies."}
                    {weather.main.temp < 5 && 
                      " Cold weather may boost heating and winter clothing demand."}
                  </p>
                  
                  <div className="context-note">
                    <strong>Note:</strong> Weather data is provided for informational purposes. 
                    Market analysis should consider multiple factors beyond weather conditions.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}