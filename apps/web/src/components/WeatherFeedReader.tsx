import React, { useEffect, useState } from 'react';

type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
};

export default function WeatherFeedReader() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get user's IP-based location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(loc => {
        if (!loc || !loc.latitude || !loc.longitude) {
          throw new Error('Nem sikerült meghatározni a helyzetet.');
        }
        // 2. Fetch weather for that location (Open-Meteo, no API key needed)
        return fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m`
        )
          .then(res => res.json())
          .then(data => {
            if (!data.current_weather) throw new Error('Nem sikerült lekérni az időjárást.');
            setWeather({
              name: loc.city || loc.country_name || 'Ismeretlen hely',
              weather: [
                {
                  description: weatherCodeToText(data.current_weather.weathercode),
                  icon: weatherCodeToIcon(data.current_weather.weathercode),
                },
              ],
              main: {
                temp: data.current_weather.temperature,
                feels_like: data.current_weather.apparent_temperature,
                humidity: data.current_weather.relative_humidity_2m,
              },
            });
            setLoading(false);
          });
      })
      .catch((err) => {
        setError('Nem sikerült lekérni az időjárási adatokat.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="welcome"><p>Időjárás betöltése…</p></div>;
  if (error) return <div className="welcome"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!weather) return null;

  return (
    <div className="welcome" style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#007bff' }}>Helyi időjárás</h2>
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
            {weather.main.temp}°C (érzet: {weather.main.feels_like}°C)
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            Páratartalom: {weather.main.humidity}%
          </div>
        </div>
      </div>
    </div>
  );
}

// Egyszerűsített időjárás kód → szöveg
function weatherCodeToText(code: number): string {
  if (code === 0) return 'Derült';
  if ([1, 2, 3].includes(code)) return 'Részben felhős';
  if ([45, 48].includes(code)) return 'Ködös';
  if ([51, 53, 55].includes(code)) return 'Szitáló eső';
  if ([61, 63, 65].includes(code)) return 'Eső';
  if ([71, 73, 75, 77].includes(code)) return 'Havazás';
  if ([80, 81, 82].includes(code)) return 'Zápor';
  if ([95, 96, 99].includes(code)) return 'Vihar';
  return 'Ismeretlen';
}

// Egyszerűsített időjárás kód → ikon (Open-Meteo nem ad képet, ezért emoji)
function weatherCodeToIcon(code: number): string {
  if (code === 0) return 'https://openweathermap.org/img/wn/01d.png';
  if ([1, 2, 3].includes(code)) return 'https://openweathermap.org/img/wn/02d.png';
  if ([45, 48].includes(code)) return 'https://openweathermap.org/img/wn/50d.png';
  if ([51, 53, 55].includes(code)) return 'https://openweathermap.org/img/wn/09d.png';
  if ([61, 63, 65].includes(code)) return 'https://openweathermap.org/img/wn/10d.png';
  if ([71, 73, 75, 77].includes(code)) return 'https://openweathermap.org/img/wn/13d.png';
  if ([80, 81, 82].includes(code)) return 'https://openweathermap.org/img/wn/09d.png';
  if ([95, 96, 99].includes(code)) return 'https://openweathermap.org/img/wn/11d.png';
  return 'https://openweathermap.org/img/wn/01d.png';
}