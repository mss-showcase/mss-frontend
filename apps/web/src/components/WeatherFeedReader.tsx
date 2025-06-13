import { useWeather } from './useWeather';

export default function WeatherFeedReader() {
  const { weather, loading, error } = useWeather();

  if (loading) return <div className="welcome"><p>Loading weather…</p></div>;
  if (error) return <div className="welcome"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!weather) return null;

  return (
    <div className="welcome" style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#007bff' }}>Local Weather</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img
          src={weather.weather[0].icon}
          alt={weather.weather[0].description}
          width={64}
          height={64}
        />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>{weather.name}</div>
          <div style={{ fontSize: 16 }}>{weather.weather[0].description}</div>
          <div style={{ fontSize: 16 }}>
            {weather.main.temp}°C (feels like: {weather.main.feels_like}°C)
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            Humidity: {weather.main.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
}