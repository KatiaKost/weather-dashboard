import { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherApi'; 
import type { CurrentWeather, ForecastResponse } from '../types/weather';

export const useWeather = (city: string) => {
  const [data, setData] = useState<{
    currentWeather: CurrentWeather | null;
    forecast: ForecastResponse | null;
  }>({ currentWeather: null, forecast: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!city || city.trim() === '') {
      setData({ currentWeather: null, forecast: null });
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [current, forecast] = await Promise.all([
          weatherService.getCurrentWeather(city),
          weatherService.getFiveDayForecast(city)
        ]);
        
        if (isMounted) {
          setData({ currentWeather: current, forecast });
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Не удалось получить данные о погоде';
          setError(new Error(errorMessage));
          setData({ currentWeather: null, forecast: null });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Дебаунс запросов
    const timeoutId = setTimeout(() => {
      fetchWeather();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [city]);

  return {
    currentWeather: data.currentWeather,
    forecast: data.forecast,
    isLoading,
    isError: !!error,
    error,
  };
};