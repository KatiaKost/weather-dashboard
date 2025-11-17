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
    return `День ${index + 1}`;
  };

  // Берем по одному прогнозу на день (каждые 24 часа)
  const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{t.headers.fiveDayForecast}</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <div key={`${day.dt}-${index}`} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="font-medium mb-2">
              {formatDay(index)}
            </div>
            <img 
              src={getWeatherIcon(day.weather[0].icon)} 
              alt={day.weather[0].description}
              className="w-12 h-12 mx-auto mb-2"
            />
            <div className="text-2xl font-bold my-1">
              {Math.round(day.main.temp)}
              <span className="text-lg">{t.units.celsius}</span>
            </div>
            <div className="text-sm text-gray-600 capitalize mb-1">
              {translateWeatherDescription(day.weather[0].description)}
            </div>
            <div className="text-xs text-gray-500">
              М: {Math.round(day.main.temp_max)}° м: {Math.round(day.main.temp_min)}°
            </div>
            <div className="mt-2 text-xs">
              <div>💧 {day.main.humidity}%</div>
              <div>💨 {day.wind.speed} м/с</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ForecastList;