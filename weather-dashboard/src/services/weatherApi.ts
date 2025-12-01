import axios from 'axios';
import type { CurrentWeather, ForecastResponse, ForecastItem } from '../types/weather';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Флаг для переключения между mock и реальными данными
const USE_MOCK_DATA = true;

// Улучшенная база данных городов с более точными данными
const getCityData = (city: string) => {
  const lowerCity = city.toLowerCase();
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const hour = now.getHours(); // 0-23
  
  // Определяем сезон и время суток
  const isWinter = month >= 11 || month <= 1;
  const isSpring = month >= 2 && month <= 4;
  const isSummer = month >= 5 && month <= 7;
  const isAutumn = month >= 8 && month <= 10;
  const isDaytime = hour >= 6 && hour <= 20;
  
  // База данных городов с учетом сезона
  const cityDatabase: { [key: string]: any } = {
    // Русские названия
    'москва': {
      englishName: 'Moscow',
      country: 'RU',
      winter: { temp: -5, condition: 'Snow', description: 'снег', icon: '13d' },
      spring: { temp: 10, condition: 'Clouds', description: 'облачно', icon: '03d' },
      summer: { temp: 22, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 8, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 3,
      humidity: 75
    },
    'санкт-петербург': {
      englishName: 'Saint Petersburg',
      country: 'RU',
      winter: { temp: -3, condition: 'Clouds', description: 'пасмурно', icon: '04d' },
      spring: { temp: 8, condition: 'Drizzle', description: 'морось', icon: '09d' },
      summer: { temp: 20, condition: 'Clouds', description: 'облачно', icon: '03d' },
      autumn: { temp: 6, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 5,
      humidity: 78
    },
    'лондон': {
      englishName: 'London',
      country: 'GB',
      winter: { temp: 5, condition: 'Rain', description: 'дождь', icon: '10d' },
      spring: { temp: 12, condition: 'Clouds', description: 'облачно', icon: '03d' },
      summer: { temp: 20, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 10, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 4,
      humidity: 80
    },
    'париж': {
      englishName: 'Paris',
      country: 'FR',
      winter: { temp: 6, condition: 'Clouds', description: 'облачно', icon: '03d' },
      spring: { temp: 15, condition: 'Clear', description: 'ясно', icon: '01d' },
      summer: { temp: 25, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 12, condition: 'Clouds', description: 'облачно', icon: '04d' },
      windSpeed: 3,
      humidity: 70
    },
    'токио': {
      englishName: 'Tokyo',
      country: 'JP',
      winter: { temp: 8, condition: 'Clear', description: 'ясно', icon: '01d' },
      spring: { temp: 18, condition: 'Clear', description: 'ясно', icon: '01d' },
      summer: { temp: 28, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 20, condition: 'Clear', description: 'ясно', icon: '01d' },
      windSpeed: 2,
      humidity: 65
    },
    'нью-йорк': {
      englishName: 'New York',
      country: 'US',
      winter: { temp: 0, condition: 'Snow', description: 'снег', icon: '13d' },
      spring: { temp: 15, condition: 'Clear', description: 'ясно', icon: '01d' },
      summer: { temp: 28, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 12, condition: 'Clouds', description: 'облачно', icon: '04d' },
      windSpeed: 4,
      humidity: 68
    },
    'казань': {
      englishName: 'Kazan',
      country: 'RU',
      winter: { temp: -8, condition: 'Snow', description: 'снег', icon: '13d' },
      spring: { temp: 8, condition: 'Clouds', description: 'облачно', icon: '04d' },
      summer: { temp: 24, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 6, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 3,
      humidity: 73
    },
    'новосибирск': {
      englishName: 'Novosibirsk',
      country: 'RU',
      winter: { temp: -15, condition: 'Snow', description: 'снег', icon: '13d' },
      spring: { temp: 5, condition: 'Clouds', description: 'облачно', icon: '04d' },
      summer: { temp: 22, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 4, condition: 'Clouds', description: 'облачно', icon: '03d' },
      windSpeed: 4,
      humidity: 70
    },
    'киев': {
      englishName: 'Kyiv',
      country: 'UA',
      winter: { temp: -2, condition: 'Snow', description: 'снег', icon: '13d' },
      spring: { temp: 12, condition: 'Clear', description: 'ясно', icon: '01d' },
      summer: { temp: 25, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 10, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 3,
      humidity: 74
    },
    'сочи': {
      englishName: 'Sochi',
      country: 'RU',
      winter: { temp: 8, condition: 'Clouds', description: 'облачно', icon: '03d' },
      spring: { temp: 16, condition: 'Clear', description: 'ясно', icon: '01d' },
      summer: { temp: 28, condition: 'Clear', description: 'ясно', icon: '01d' },
      autumn: { temp: 18, condition: 'Rain', description: 'дождь', icon: '10d' },
      windSpeed: 2,
      humidity: 70
    }
  };
  
  const cityInfo = cityDatabase[lowerCity];
  
  if (cityInfo) {
    let seasonData;
    if (isWinter) seasonData = cityInfo.winter;
    else if (isSpring) seasonData = cityInfo.spring;
    else if (isSummer) seasonData = cityInfo.summer;
    else seasonData = cityInfo.autumn;
    
    // Корректировка температуры в зависимости от времени суток
    let temp = seasonData.temp;
    if (!isDaytime) {
      temp -= 5; // Ночью холоднее
    }
    
    return {
      englishName: cityInfo.englishName,
      temperature: temp,
      humidity: cityInfo.humidity,
      condition: seasonData.condition,
      description: seasonData.description,
      icon: seasonData.icon,
      windSpeed: cityInfo.windSpeed,
      country: cityInfo.country
    };
  }
  
  // Для неизвестных городов - случайные данные с учетом сезона
  let baseTemp, condition, description, icon;
  
  if (isWinter) {
    baseTemp = Math.random() > 0.7 ? -10 + Math.random() * 15 : 0 + Math.random() * 5;
    condition = Math.random() > 0.5 ? 'Snow' : 'Clouds';
    description = Math.random() > 0.5 ? 'снег' : 'облачно';
    icon = Math.random() > 0.5 ? '13d' : '04d';
  } else if (isSummer) {
    baseTemp = 20 + Math.random() * 15;
    condition = Math.random() > 0.7 ? 'Clear' : 'Clouds';
    description = Math.random() > 0.7 ? 'ясно' : 'облачно';
    icon = Math.random() > 0.7 ? '01d' : '03d';
  } else {
    baseTemp = 5 + Math.random() * 15;
    condition = Math.random() > 0.6 ? 'Clouds' : Math.random() > 0.8 ? 'Rain' : 'Clear';
    description = condition === 'Rain' ? 'дождь' : condition === 'Clouds' ? 'облачно' : 'ясно';
    icon = condition === 'Rain' ? '10d' : condition === 'Clouds' ? '04d' : '01d';
  }
  
  // Ночная корректировка
  if (!isDaytime) {
    baseTemp -= 5;
  }
  
  return {
    englishName: city,
    temperature: Math.round(baseTemp),
    humidity: 60 + Math.round(Math.random() * 30),
    condition: condition,
    description: description,
    icon: icon,
    windSpeed: 2 + Math.round(Math.random() * 6),
    country: 'RU'
  };
};

const getMockWeather = (city: string): CurrentWeather => {
  const cityData = getCityData(city);
  const now = new Date();
  
  return {
    name: cityData.englishName || city,
    main: {
      temp: cityData.temperature,
      feels_like: cityData.temperature - (Math.random() > 0.5 ? 2 : 3),
      humidity: cityData.humidity,
      pressure: 1013 - Math.round(Math.random() * 20),
      temp_min: cityData.temperature - Math.round(Math.random() * 5),
      temp_max: cityData.temperature + Math.round(Math.random() * 5),
    },
    weather: [
      {
        main: cityData.condition,
        description: cityData.description,
        icon: cityData.icon,
      },
    ],
    wind: {
      speed: cityData.windSpeed,
      deg: Math.round(Math.random() * 360),
    },
    sys: {
      country: cityData.country,
      sunrise: Math.floor(now.setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(now.setHours(21, 0, 0, 0) / 1000),
    },
    visibility: 10000 - Math.round(Math.random() * 3000),
    dt: Math.floor(Date.now() / 1000),
  };
};

const getMockForecast = (city: string): ForecastResponse => {
  const cityData = getCityData(city);
  const forecastItems: ForecastItem[] = [];
  
  for (let i = 0; i < 40; i++) {
    const date = new Date(Date.now() + i * 10800 * 1000);
    const dayIndex = Math.floor(i / 8);
    const hour = date.getHours();
    
    // Температура меняется в течение дня
    let dailyTemp = cityData.temperature;
    if (hour < 6 || hour > 22) dailyTemp -= 5; // Ночью холоднее
    if (hour >= 12 && hour <= 16) dailyTemp += 3; // Днем теплее
    
    // Добавляем небольшие случайные колебания
    dailyTemp += (Math.random() - 0.5) * 4;
    
    // Погода может меняться в течение прогноза
    let condition = cityData.condition;
    let description = cityData.description;
    let icon = cityData.icon;
    
    if (dayIndex > 2) {
      // Через несколько дней погода может измениться
      if (Math.random() > 0.7) {
        condition = Math.random() > 0.5 ? 'Clouds' : 'Clear';
        description = condition === 'Clouds' ? 'облачно' : 'ясно';
        icon = condition === 'Clouds' ? '03d' : '01d';
      }
    }
    
    forecastItems.push({
      dt: Math.floor(date.getTime() / 1000),
      main: {
        temp: dailyTemp,
        feels_like: dailyTemp - 2,
        humidity: cityData.humidity + Math.round(Math.random() * 20 - 10),
        pressure: 1013 - Math.round(Math.random() * 20),
        temp_min: dailyTemp - 3 - Math.random() * 2,
        temp_max: dailyTemp + 3 + Math.random() * 2,
      },
      weather: [
        {
          main: condition,
          description: description,
          icon: icon,
        },
      ],
      wind: {
        speed: cityData.windSpeed + Math.random() * 2,
        deg: Math.round(Math.random() * 360),
      },
      visibility: 10000 - Math.round(Math.random() * 3000),
      pop: dayIndex === 0 ? 0.1 : Math.random() * 0.3, // Вероятность осадков
      dt_txt: date.toISOString(),
    });
  }

  return {
    list: forecastItems,
    city: {
      name: cityData.englishName || city,
      country: cityData.country,
      timezone: 0,
    },
  };
};

export const weatherService = {
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    if (USE_MOCK_DATA) {
      console.log('Using improved mock data for:', city);
      return getMockWeather(city);
    }
    
    try {
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('Fetching weather from:', url);
      
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('API request failed, using improved mock data:', error);
      return getMockWeather(city);
    }
  },

  async getFiveDayForecast(city: string): Promise<ForecastResponse> {
    if (USE_MOCK_DATA) {
      console.log('Using improved mock forecast for:', city);
      return getMockForecast(city);
    }
    
    try {
      const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('Fetching forecast from:', url);
      
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('API request failed, using improved mock data:', error);
      return getMockForecast(city);
    }
  },
};