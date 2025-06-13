export function weatherCodeToText(code: number): string {
  if (code === 0) return 'Clear';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55].includes(code)) return 'Drizzle';
  if ([61, 63, 65].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
}

export function weatherCodeToIcon(code: number): string {
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