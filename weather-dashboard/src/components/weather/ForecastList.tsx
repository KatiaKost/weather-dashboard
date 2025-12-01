import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import type { ForecastResponse } from '../../types/weather';

interface ForecastListProps {
  data: ForecastResponse;
}

export const ForecastList = ({ data }: ForecastListProps) => {
  const t = useTranslation();

  // Функция для получения иконки погоды
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Функция для перевода описания погоды
  const translateWeatherDescription = (description: string) => {
    const descriptionMap: { [key: string]: string } = {
      'clear sky': t.weatherDescriptions.clear,
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
      'rain': t.weatherDescriptions.rain,
      'snow': t.weatherDescriptions.snow,
      'thunderstorm': t.weatherDescriptions.thunderstorm,
      'mist': t.weatherDescriptions.mist,
      'smoke': t.weatherDescriptions.smoke,
      'haze': t.weatherDescriptions.haze,
      'fog': t.weatherDescriptions.fog,
    };

    return descriptionMap[description] || description;
  };

  // Функция для форматирования даты
  const formatDay = (index: number) => {
    if (index === 0) return t.days.today;
    if (index === 1) return t.days.tomorrow;
    if (index === 2) return t.days.dayAfterTomorrow;
    
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  // Берем по одному прогнозу на день (каждые 24 часа)
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <Card className="p-6 animate-fade-in hover-lift">
      <h3 className="text-xl font-semibold mb-6 animate-slide-in">
        {t.headers.fiveDayForecast}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <div
            key={`${day.dt}-${index}`}
            className="text-center p-4 bg-gray-50 rounded-lg smooth-transition hover:bg-gray-100 hover-lift animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="font-medium mb-3 text-gray-800">
              {formatDay(index)}
            </div>
            
            <div className="transform hover:scale-110 transition-transform duration-300 mb-3">
              <img 
                src={getWeatherIcon(day.weather[0].icon)} 
                alt={day.weather[0].description}
                className="w-14 h-14 mx-auto"
                loading="lazy"
              />
            </div>
            
            <div className="text-2xl font-bold my-2 text-gray-900 animate-scale-in">
              {Math.round(day.main.temp)}
              <span className="text-lg">{t.units.celsius}</span>
            </div>
            
            <div className="text-sm text-gray-600 capitalize mb-2 line-clamp-1">
              {translateWeatherDescription(day.weather[0].description)}
            </div>
            
            <div className="text-xs text-gray-500 mb-3">
              <span className="font-medium">Макс: {Math.round(day.main.temp_max)}°</span>
              <span className="mx-1">•</span>
              <span className="font-medium">Мин: {Math.round(day.main.temp_min)}°</span>
            </div>
            
            <div className="mt-3 space-y-1 text-xs text-gray-700">
              <div className="flex items-center justify-center gap-1">
                <span className="text-blue-500">💧</span>
                <span>Влажность: {day.main.humidity}%</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-gray-500">💨</span>
                <span>Ветер: {Math.round(day.wind.speed)} м/с</span>
              </div>
              {day.pop > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-blue-400">🌧️</span>
                  <span>Осадки: {(day.pop * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
            
            {/* Индикатор времени */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-400">
                {new Date(day.dt_txt).toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Пояснение для пользователя */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Показан прогноз на 5 дней. Данные обновляются каждые 3 часа.
        </p>
      </div>
    </Card>
  );
};

export default ForecastList;