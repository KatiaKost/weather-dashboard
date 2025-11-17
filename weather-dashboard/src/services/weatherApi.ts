import axios from 'axios';
import type { CurrentWeather, ForecastResponse, ForecastItem } from '../types/weather';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const weatherService = {
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    const response = await weatherApi.get<CurrentWeather>('/weather', {
      params: { q: city },
    });
    return response.data;
  },

  async getFiveDayForecast(city: string): Promise<ForecastResponse> {
    const response = await weatherApi.get<ForecastResponse>('/forecast', {
      params: { q: city },
    });
    return response.data;
  },
};

// Обновляем мок-сервис чтобы сначала пробовать реальный API
export const mockWeatherService = {
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      console.log('Fetching real weather data for:', city);
      return await weatherService.getCurrentWeather(city);
    } catch (error) {
      console.warn('Real API failed, using mock data:', error);
      // Только если реальный API не работает, используем мок
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        name: city,
        main: {
          temp: Math.round(Math.random() * 30 - 5), // Случайная температура от -5 до 25
          feels_like: Math.round(Math.random() * 30 - 5),
          humidity: Math.round(Math.random() * 50 + 30), // 30-80%
          pressure: Math.round(Math.random() * 100 + 1000), // 1000-1100
          temp_min: Math.round(Math.random() * 25 - 5),
          temp_max: Math.round(Math.random() * 35 - 5),
        },
        weather: [
          {
            main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
            description: 'test data',
            icon: '01d',
          },
        ],
        wind: {
          speed: Math.round(Math.random() * 10 + 1), // 1-11 м/с
          deg: Math.round(Math.random() * 360),
        },
        sys: {
          country: 'RU',
          sunrise: Math.floor(Date.now() / 1000) - 3600,
          sunset: Math.floor(Date.now() / 1000) + 3600,
        },
        visibility: 10000,
        dt: Math.floor(Date.now() / 1000),
      };
    }
  },

  async getFiveDayForecast(city: string): Promise<ForecastResponse> {
    try {
      console.log('Fetching real forecast for:', city);
      return await weatherService.getFiveDayForecast(city);
    } catch (error) {
      console.warn('Real API failed, using mock forecast:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const forecastItems: ForecastItem[] = [];
      const baseTemp = Math.round(Math.random() * 25 + 5); // Базовая температура 5-30°C
      
      for (let i = 0; i < 40; i++) {
        forecastItems.push({
          dt: Math.floor(Date.now() / 1000) + i * 10800,
          main: {
            temp: baseTemp + Math.round(Math.random() * 8 - 4), // ±4°C от базовой
            feels_like: baseTemp + Math.round(Math.random() * 8 - 4),
            humidity: Math.round(Math.random() * 50 + 30),
            pressure: 1013,
            temp_min: baseTemp + Math.round(Math.random() * 6 - 6),
            temp_max: baseTemp + Math.round(Math.random() * 6 + 2),
          },
          weather: [
            {
              main: i % 2 === 0 ? 'Clouds' : 'Clear',
              description: i % 2 === 0 ? 'scattered clouds' : 'clear sky',
              icon: i % 2 === 0 ? '03d' : '01d',
            },
          ],
          wind: {
            speed: 3 + Math.round(Math.random() * 8),
            deg: 180,
          },
          visibility: 10000,
          pop: 0.1,
          dt_txt: new Date(Date.now() + i * 10800 * 1000).toISOString(),
        });
      }

      return {
        list: forecastItems,
        city: {
          name: city,
          country: 'RU',
          timezone: 0,
        },
      };
    }
  },
};