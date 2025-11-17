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

// Резервный мок-сервис
export const mockWeatherService = {
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      return await weatherService.getCurrentWeather(city);
    } catch (error) {
      console.warn('Using mock data due to API error:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        name: city,
        main: {
          temp: 15,
          feels_like: 14,
          humidity: 65,
          pressure: 1013,
          temp_min: 12,
          temp_max: 18,
        },
        weather: [
          {
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d',
          },
        ],
        wind: {
          speed: 3.5,
          deg: 180,
        },
        sys: {
          country: 'US',
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
      return await weatherService.getFiveDayForecast(city);
    } catch (error) {
      console.warn('Using mock forecast data due to API error:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const forecastItems: ForecastItem[] = [];
      for (let i = 0; i < 40; i++) { // 5 days * 8 forecasts per day
        forecastItems.push({
          dt: Math.floor(Date.now() / 1000) + i * 10800, // Every 3 hours
          main: {
            temp: 15 + i * 0.5,
            feels_like: 14 + i * 0.5,
            humidity: 60 + i,
            pressure: 1013,
            temp_min: 12 + i * 0.5,
            temp_max: 18 + i * 0.5,
          },
          weather: [
            {
              main: i % 2 === 0 ? 'Clouds' : 'Clear',
              description: i % 2 === 0 ? 'scattered clouds' : 'clear sky',
              icon: i % 2 === 0 ? '03d' : '01d',
            },
          ],
          wind: {
            speed: 3 + i * 0.1,
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
          country: 'US',
          timezone: 0,
        },
      };
    }
  },
};