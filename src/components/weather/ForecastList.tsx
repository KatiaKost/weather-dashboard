import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';
import { ForecastResponse } from '../../types/weather';

interface ForecastListProps {
  data: ForecastResponse;
}

// Хелпер-функции вне компонента
const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const translateWeatherDescriptionHelper = (description: string, t?: any): string => {
  const descriptionMap: { [key: string]: string } = {
    'clear sky': t?.weatherDescriptions?.clear || 'ясно',
    'few clouds': 'небольшая облачность',
    'scattered clouds': 'рассеянные облака',
    'broken clouds': 'облачно с прояснениями',
    'overcast clouds': 'пасмурно',
    'light rain': 'небольшой дождь',
    'moderate rain': 'умеренный дождь',
    'heavy intensity rain': 'сильный дождь',
    'very heavy rain': 'очень сильный дождь',
    'extreme rain': 'экстремальный дождь',
    'freezing rain': 'ледяной дождь',
    'light snow': 'небольшой снег',
    'heavy snow': 'сильный снег',
    'sleet': 'мокрый снег',
    'shower rain': 'ливень',
    'rain': t?.weatherDescriptions?.rain || 'дождь',
    'snow': t?.weatherDescriptions?.snow || 'снег',
    'thunderstorm': t?.weatherDescriptions?.thunderstorm || 'гроза',
    'mist': t?.weatherDescriptions?.mist || 'туман',
    'smoke': t?.weatherDescriptions?.smoke || 'дымка',
    'haze': t?.weatherDescriptions?.haze || 'мгла',
    'fog': t?.weatherDescriptions?.fog || 'туман',
  };

  return descriptionMap[description] || description;
};

const formatDayHelper = (index: number, t?: any): string => {
  if (index === 0) return t?.days?.today || 'Сегодня';
  if (index === 1) return t?.days?.tomorrow || 'Завтра';
  if (index === 2) return t?.days?.dayAfterTomorrow || 'Послезавтра';
  
  const date = new Date();
  date.setDate(date.getDate() + index);
  return date.toLocaleDateString('ru-RU', { weekday: 'short' });
};

// Функция для получения дневных прогнозов
const getDailyForecasts = (list: any[]) => {
  if (!list || list.length === 0) return [];
  
  // Группируем по дням
  const forecastsByDay: { [key: string]: any[] } = {};
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!forecastsByDay[dayKey]) {
      forecastsByDay[dayKey] = [];
    }
    forecastsByDay[dayKey].push(item);
  });
  
  // Получаем ключи дней и сортируем их
  const dayKeys = Object.keys(forecastsByDay).sort();
  
  // Для каждого дня берем прогноз на 12:00 или ближайший к полудню
  const dailyForecasts: any[] = [];
  
  dayKeys.slice(0, 5).forEach(dayKey => {
    const dayForecasts = forecastsByDay[dayKey];
    
    // Находим прогноз ближе к полудню (12:00)
    const noonForecast = dayForecasts.reduce((closest, forecast) => {
      const forecastDate = new Date(forecast.dt * 1000);
      const closestDate = new Date(closest.dt * 1000);
      
      const forecastHour = forecastDate.getHours();
      const closestHour = closestDate.getHours();
      
      const forecastDiff = Math.abs(forecastHour - 12);
      const closestDiff = Math.abs(closestHour - 12);
      
      // Если разница одинаковая, берем тот, который позже (ближе к вечеру)
      if (forecastDiff === closestDiff) {
        return forecastHour > closestHour ? forecast : closest;
      }
      
      return forecastDiff < closestDiff ? forecast : closest;
    }, dayForecasts[0]);
    
    dailyForecasts.push(noonForecast);
  });
  
  return dailyForecasts;
};

export const ForecastList = ({ data }: ForecastListProps) => {
  const t = useTranslation();
  const [selectedDay, setSelectedDay] = useState(0);

  // Проверка данных
  if (!data || !data.list || data.list.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 py-8">
          Нет данных для прогноза
        </div>
      </Card>
    );
  }

  // Используем новую функцию для получения дневных прогнозов
  const dailyForecasts = getDailyForecasts(data.list);

  // Отладочная информация
  console.log('Forecast data:', {
    city: data.city.name,
    totalItems: data.list.length,
    dailyForecasts: dailyForecasts.map((f, i) => ({
      day: i,
      date: new Date(f.dt * 1000).toLocaleString('ru-RU'),
      temp: f.main.temp,
      hour: new Date(f.dt * 1000).getHours()
    }))
  });

  // Функции-обертки для использования переводов
  const translateWeatherDescription = (description: string) => {
    return translateWeatherDescriptionHelper(description, t);
  };

  const formatDay = (index: number) => {
    return formatDayHelper(index, t);
  };

  // Мобильная версия карточки как обычная функция
  const renderMobileCard = (day: any, index: number) => (
    <div
      key={`${day.dt}-${index}`}
      className={`flex-shrink-0 w-48 p-4 rounded-xl transition-all cursor-pointer ${
        selectedDay === index 
          ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' 
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={() => setSelectedDay(index)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-800 dark:text-gray-200">
          {formatDay(index)}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(day.dt * 1000).toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'short' 
          })}
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-3">
        <img 
          src={getWeatherIcon(day.weather[0].icon)}
          alt={day.weather[0].description}
          className="w-14 h-14"
          onError={(e) => {
            e.currentTarget.src = '/weather-icon-fallback.png';
          }}
        />
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {Math.round(day.main.temp)}°
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize line-clamp-1">
          {translateWeatherDescription(day.weather[0].description)}
        </div>
      </div>
    </div>
  );

  // Десктопная версия карточки как обычная функция
  const renderDesktopCard = (day: any, index: number) => {
    const date = new Date(day.dt * 1000);
    const isToday = index === 0;
    
    return (
      <div 
        key={`${day.dt}-${index}`}
        className="group p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="text-center mb-4">
          <div className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-1">
            {formatDay(index)}
          </div>
          <div className="text-sm text-gray-500">
            {date.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {date.getHours()}:00
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <img 
              src={getWeatherIcon(day.weather[0].icon)}
              alt={day.weather[0].description}
              className="w-16 h-16"
              onError={(e) => {
                e.currentTarget.src = '/weather-icon-fallback.png';
              }}
            />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round(day.main.temp)}°
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {translateWeatherDescription(day.weather[0].description)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Ощущается: {Math.round(day.main.feels_like)}°
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Макс:</span>
            <span className="font-bold">{Math.round(day.main.temp_max)}°</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Мин:</span>
            <span className="font-bold">{Math.round(day.main.temp_min)}°</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">💧 Влажность:</span>
            <span className="font-bold">{day.main.humidity}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">💨 Ветер:</span>
            <span className="font-bold">{Math.round(day.wind.speed)} м/с</span>
          </div>
          {day.pop > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">🌧️ Осадки:</span>
              <span className="font-bold">{(day.pop * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        
      </div>
    );
  };

  return (
    
    <Card className="p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {t.headers?.fiveDayForecast}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {data.city.name}
          </span>
        </div>
      </div>


      {/* Мобильная версия - упрощенная */}
      <div className="lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
          {dailyForecasts.map((day, index) => renderMobileCard(day, index))}
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          Нажмите на день для подробной информации
        </div>
      </div>
      
      {/* Десктопная версия */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => renderDesktopCard(day, index))}
      </div>
      
      {/* Подсказка */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 Прогноз обновляется каждые 3 часа. Температура указана для времени, ближайшего к полудню.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ForecastList;