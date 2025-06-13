import { useEffect, useState } from 'react';
import { weatherCodeToText, weatherCodeToIcon } from './weatherUtils';

type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const locRes = await fetch('https://ipapi.co/json/');
        const loc = await locRes.json();
        if (!loc || !loc.latitude || !loc.longitude) {
          throw new Error('Could not determine your location.');
        }
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m`
        );
        const data = await weatherRes.json();
        if (!data.current_weather) throw new Error('Could not fetch weather data.');
        setWeather({
          name: loc.city || loc.country_name || 'Unknown location',
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
      } catch {
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return { weather, loading, error };
}