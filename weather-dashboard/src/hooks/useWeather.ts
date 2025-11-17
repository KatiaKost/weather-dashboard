import { useState, useEffect } from 'react';
import { mockWeatherService } from '../services/weatherApi';
import type { CurrentWeather, ForecastResponse } from '../types/weather';

export const useWeather = (city: string) => {
  const [data, setData] = useState<{
    currentWeather: CurrentWeather | null;
    forecast: ForecastResponse | null;
  }>({ currentWeather: null, forecast: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [current, forecast] = await Promise.all([
          mockWeatherService.getCurrentWeather(city),
          mockWeatherService.getFiveDayForecast(city)
        ]);
        
        setData({ currentWeather: current, forecast });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return {
    currentWeather: data.currentWeather,
    forecast: data.forecast,
    isLoading,
    isError: !!error,
    error,
  };
};