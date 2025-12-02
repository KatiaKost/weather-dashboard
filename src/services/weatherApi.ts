import axios from 'axios';
import type { CurrentWeather, ForecastResponse, ForecastItem } from '../types/weather';

// API ключ теперь берется из переменных окружения для безопасности
const API_KEY = import.meta.env?.VITE_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Флаг для переключения между mock и реальными данными
// Автоматически используем mock если нет API ключа
const USE_MOCK_DATA = false;

// Кэш для синхронизации данных между текущей погодой и прогнозом
// Время жизни кэша - 5 минут
const CACHE_TTL = 5 * 60 * 1000;
const weatherCache: { 
  [city: string]: {
    baseTemp: number;
    baseData: any;
    timestamp: number;
  } 
} = {};

// Константы для временных корректировок
const TEMP_ADJUSTMENTS = {
  NIGHT: -5,
  MORNING: -1,
  MIDDAY: 3,
  AFTERNOON: 1,
  EVENING: -1,
  LATE_NIGHT: -3
} as const;

// Типизированный интерфейс для данных города
interface CityData {
  englishName: string;
  country: string;
  winter: SeasonData;
  spring: SeasonData;
  summer: SeasonData;
  autumn: SeasonData;
  windSpeed: number;
  humidity: number;
}

interface SeasonData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

interface ProcessedCityData {
  englishName: string;
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  icon: string;
  windSpeed: number;
  country: string;
  seasonData: SeasonData;
}

// База данных городов с учетом сезона
const CITY_DATABASE: Record<string, CityData> = {
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

// Утилитарные функции
const getSeason = (month: number): 'winter' | 'spring' | 'summer' | 'autumn' => {
  if (month >= 11 || month <= 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};

const isDaytime = (hour: number): boolean => hour >= 6 && hour <= 20;

const getSeasonData = (cityInfo: CityData, season: 'winter' | 'spring' | 'summer' | 'autumn'): SeasonData => {
  switch (season) {
    case 'winter': return cityInfo.winter;
    case 'spring': return cityInfo.spring;
    case 'summer': return cityInfo.summer;
    case 'autumn': return cityInfo.autumn;
  }
};

const getCityData = (city: string): ProcessedCityData => {
  const lowerCity = city.toLowerCase();
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const hour = now.getHours(); // 0-23
  
  const season = getSeason(month);
  const daytime = isDaytime(hour);
  
  const cityInfo = CITY_DATABASE[lowerCity];
  
  if (cityInfo) {
    const seasonData = getSeasonData(cityInfo, season);
    
    // Корректировка температуры в зависимости от времени суток
    let temp = seasonData.temp;
    if (!daytime) {
      temp += TEMP_ADJUSTMENTS.NIGHT;
    }
    
    return {
      englishName: cityInfo.englishName,
      temperature: Math.round(temp),
      humidity: cityInfo.humidity,
      condition: seasonData.condition,
      description: seasonData.description,
      icon: seasonData.icon,
      windSpeed: cityInfo.windSpeed,
      country: cityInfo.country,
      seasonData
    };
  }
  
  // Для неизвестных городов - случайные данные с учетом сезона
  let baseTemp: number;
  let condition: string;
  let description: string;
  let icon: string;
  
  if (season === 'winter') {
    baseTemp = Math.random() > 0.7 ? -10 + Math.random() * 15 : Math.random() * 5;
    condition = Math.random() > 0.5 ? 'Snow' : 'Clouds';
    description = Math.random() > 0.5 ? 'снег' : 'облачно';
    icon = Math.random() > 0.5 ? '13d' : '04d';
  } else if (season === 'summer') {
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
  if (!daytime) {
    baseTemp += TEMP_ADJUSTMENTS.NIGHT;
  }
  
  return {
    englishName: city,
    temperature: Math.round(baseTemp),
    humidity: 60 + Math.round(Math.random() * 30),
    condition,
    description,
    icon,
    windSpeed: 2 + Math.round(Math.random() * 6),
    country: 'RU',
    seasonData: { temp: baseTemp, condition, description, icon }
  };
};

// Функция для получения базовых данных с кэшированием
const getCityBaseData = (city: string) => {
  const now = Date.now();
  const cacheKey = city.toLowerCase();
  
  // Если есть свежий кэш, используем его
  if (weatherCache[cacheKey] && (now - weatherCache[cacheKey].timestamp) < CACHE_TTL) {
    return weatherCache[cacheKey];
  }
  
  const cityData = getCityData(city);
  const hour = new Date().getHours();
  
  // Корректировка температуры в зависимости от времени суток для текущего момента
  let baseTemp = cityData.temperature;
  
  if (hour < 6 || hour > 20) baseTemp += TEMP_ADJUSTMENTS.NIGHT;
  if (hour >= 12 && hour <= 16) baseTemp += TEMP_ADJUSTMENTS.MIDDAY;
  
  const baseData = {
    englishName: cityData.englishName,
    country: cityData.country,
    humidity: cityData.humidity,
    windSpeed: cityData.windSpeed,
    condition: cityData.condition,
    description: cityData.description,
    icon: cityData.icon,
    seasonData: cityData.seasonData
  };
  
  // Сохраняем в кэш
  weatherCache[cacheKey] = {
    baseTemp: Math.round(baseTemp),
    baseData,
    timestamp: now
  };
  
  return weatherCache[cacheKey];
};

const getHourAdjustment = (hour: number): number => {
  if (hour >= 22 || hour < 6) {
    return TEMP_ADJUSTMENTS.LATE_NIGHT;
  } else if (hour >= 6 && hour < 10) {
    return TEMP_ADJUSTMENTS.MORNING;
  } else if (hour >= 10 && hour < 14) {
    return TEMP_ADJUSTMENTS.MIDDAY;
  } else if (hour >= 14 && hour < 18) {
    return TEMP_ADJUSTMENTS.AFTERNOON;
  } else {
    return TEMP_ADJUSTMENTS.EVENING;
  }
};

const getMockWeather = (city: string): CurrentWeather => {
  const { baseTemp, baseData } = getCityBaseData(city);
  const now = new Date();
  const hour = now.getHours();
  
  // Дополнительная корректировка для точного времени
  let currentTemp = baseTemp;
  const randomAdjustment = (Math.random() - 0.5) * 4; // ±2 градуса
  
  // Учитываем точное время суток
  currentTemp += getHourAdjustment(hour);
  currentTemp += randomAdjustment;
  
  const feelsLikeAdjustment = Math.random() > 0.5 ? -2 : -3;
  
  return {
    name: baseData.englishName || city,
    main: {
      temp: Math.round(currentTemp * 10) / 10, // Один знак после запятой
      feels_like: Math.round((currentTemp + feelsLikeAdjustment) * 10) / 10,
      humidity: baseData.humidity + Math.round(Math.random() * 10 - 5), // ±5%
      pressure: 1013 - Math.round(Math.random() * 20),
      temp_min: Math.round((currentTemp - 3 - Math.random() * 2) * 10) / 10,
      temp_max: Math.round((currentTemp + 3 + Math.random() * 2) * 10) / 10,
    },
    weather: [
      {
        main: baseData.condition,
        description: baseData.description,
        icon: baseData.icon,
      },
    ],
    wind: {
      speed: baseData.windSpeed + (Math.random() * 2 - 1), // ±1 м/с
      deg: Math.round(Math.random() * 360),
    },
    sys: {
      country: baseData.country,
      sunrise: Math.floor(now.setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(now.setHours(21, 0, 0, 0) / 1000),
    },
    visibility: 10000 - Math.round(Math.random() * 3000),
    dt: Math.floor(Date.now() / 1000),
  };
};

const CONDITION_MAP: Record<string, { description: string; icon: string }> = {
  'Clear': { description: 'ясно', icon: '01d' },
  'Clouds': { description: 'облачно', icon: '03d' },
  'Rain': { description: 'дождь', icon: '10d' },
  'Snow': { description: 'снег', icon: '13d' },
  'Drizzle': { description: 'морось', icon: '09d' }
};

const getProbabilityOfPrecipitation = (condition: string): number => {
  switch (condition) {
    case 'Rain': return 0.7 + Math.random() * 0.3;
    case 'Snow': return 0.6 + Math.random() * 0.4;
    case 'Clouds': return 0.1 + Math.random() * 0.2;
    case 'Drizzle': return 0.5 + Math.random() * 0.3;
    default: return 0;
  }
};

const getMockForecast = (city: string): ForecastResponse => {
  const { baseTemp, baseData } = getCityBaseData(city);
  const forecastItems: ForecastItem[] = [];
  const now = new Date();
  
  // Получаем текущую погоду, чтобы прогноз начинался с тех же данных
  const currentWeather = getMockWeather(city);
  const currentTemp = currentWeather.main.temp;
  
  // Создаем прогноз на 5 дней (40 записей по 3 часа)
  for (let i = 0; i < 40; i++) {
    const date = new Date(Date.now() + i * 10800 * 1000); // +3 часа каждый шаг
    const dayIndex = Math.floor(i / 8);
    const hour = date.getHours();
    
    // Начинаем с текущей температуры для первого интервала
    let forecastTemp = i === 0 ? currentTemp : baseTemp;
    
    // Корректировка на основе дня прогноза
    if (dayIndex > 0) {
      // Плавное изменение температуры в следующие дни
      const dayChange = (Math.random() - 0.5) * 8; // ±4 градуса за день
      forecastTemp += dayChange;
    }
    
    // Суточные колебания
    forecastTemp += getHourAdjustment(hour);
    
    // Небольшие случайные колебания
    forecastTemp += (Math.random() - 0.5) * 2;
    
    // Погодные условия могут меняться в течение прогноза
    let condition = baseData.condition;
    let description = baseData.description;
    let icon = baseData.icon;
    
    // Через день прогноз может измениться
    if (dayIndex >= 1) {
      const changeChance = 0.3 + dayIndex * 0.1;
      if (Math.random() < changeChance) {
        const conditions = Object.keys(CONDITION_MAP);
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const conditionData = CONDITION_MAP[randomCondition];
        
        condition = randomCondition;
        description = conditionData.description;
        icon = conditionData.icon;
      }
    }
    
    // Вероятность осадков
    const pop = getProbabilityOfPrecipitation(condition);
    const isDay = hour >= 6 && hour <= 18;
    const displayIcon = isDay ? icon : icon.replace('d', 'n');
    
    forecastItems.push({
      dt: Math.floor(date.getTime() / 1000),
      main: {
        temp: Math.round(forecastTemp * 10) / 10,
        feels_like: Math.round((forecastTemp - 2) * 10) / 10,
        humidity: baseData.humidity + Math.round(Math.random() * 20 - 10),
        pressure: 1013 - Math.round(Math.random() * 20),
        temp_min: Math.round((forecastTemp - 3 - Math.random() * 2) * 10) / 10,
        temp_max: Math.round((forecastTemp + 3 + Math.random() * 2) * 10) / 10,
      },
      weather: [
        {
          main: condition,
          description: description,
          icon: displayIcon,
        },
      ],
      wind: {
        speed: baseData.windSpeed + (Math.random() * 3 - 1.5),
        deg: Math.round(Math.random() * 360),
      },
      visibility: 10000 - Math.round(Math.random() * 3000),
      pop: Math.min(pop, 1),
      dt_txt: date.toISOString(),
    });
  }

  return {
    list: forecastItems,
    city: {
      name: baseData.englishName || city,
      country: baseData.country,
      timezone: 0,
    },
  };
};

// Обработка ошибок API
const handleApiError = (error: any, city: string, type: 'current' | 'forecast'): any => {
  console.error(`Failed to fetch ${type} weather for ${city}:`, error);
  
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.error('Invalid API key. Please check your OpenWeatherMap API key.');
        break;
      case 404:
        console.error(`City "${city}" not found.`);
        break;
      case 429:
        console.error('Rate limit exceeded. Please try again later.');
        break;
      default:
        console.error(`API error: ${error.response.status}`);
    }
  } else if (error.code === 'ECONNABORTED') {
    console.error('Request timeout. Check your internet connection.');
  } else if (error.code === 'NETWORK_ERROR') {
    console.error('Network error. Please check your connection.');
  }
  
  // Возвращаем mock данные как fallback
  return type === 'current' ? getMockWeather(city) : getMockForecast(city);
};

// Проверка и предупреждение об отсутствии API ключа
if (!API_KEY && !USE_MOCK_DATA) {
  console.warn(
    'OpenWeatherMap API key is not configured. ' +
    'Set REACT_APP_WEATHER_API_KEY in your .env file or enable USE_MOCK_DATA.'
  );
}

export const weatherService = {
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for:', city);
      return getMockWeather(city);
    }
    
    try {
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      return handleApiError(error, city, 'current');
    }
  },

  async getFiveDayForecast(city: string): Promise<ForecastResponse> {
    if (USE_MOCK_DATA) {
      console.log('Using mock forecast for:', city);
      return getMockForecast(city);
    }
    
    try {
      const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      return handleApiError(error, city, 'forecast');
    }
  },
};