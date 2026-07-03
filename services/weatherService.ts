import { Geolocation, WeatherData } from '../types';

/**
 * Mocks fetching real-time weather data. In a real frontend-only app,
 * this would call a public weather API, but that would expose an API key.
 * Mocking is a secure alternative for this context.
 * @param location The geographical coordinates to fetch weather for.
 * @returns A promise that resolves to the current weather data.
 */
export const fetchWeatherData = (location: Geolocation): Promise<WeatherData> => {
  console.log(`Mocking weather data fetch for: ${location.latitude}, ${location.longitude}`);
  
  // Simulate a realistic delay
  return new Promise(resolve => {
    setTimeout(() => {
      const mockData: WeatherData = {
        temperature_celsius: 25.5,
        wind_speed_kph: 15.2,
        precipitation_mm_per_hr: 0.5,
        description: 'Partly cloudy',
      };
      resolve(mockData);
    }, 500);
  });
};