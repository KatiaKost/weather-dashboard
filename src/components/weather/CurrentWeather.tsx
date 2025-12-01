import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavoritesStore } from '../../stores/favoritesStore';
import type { CurrentWeather as CurrentWeatherType } from '../../types/weather';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const t = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isCityFavorite = isFavorite(data.name);

  // Функция для перевода названий городов
  const translateCityName = (englishName: string): string => {
    const cityMap: { [key: string]: string } = {
      'Moscow': 'Москва',
      'Saint Petersburg': 'Санкт-Петербург',
      'Novosibirsk': 'Новосибирск',
      'Yekaterinburg': 'Екатеринбург',
      'Kazan': 'Казань',
      'Nizhny Novgorod': 'Нижний Новгород',
      'Chelyabinsk': 'Челябинск',
      'Samara': 'Самара',
      'Omsk': 'Омск',
      'Rostov-on-Don': 'Ростов-на-Дону',
      'Ufa': 'Уфа',
      'Krasnoyarsk': 'Красноярск',
      'Voronezh': 'Воронеж',
      'Perm': 'Пермь',
      'Volgograd': 'Волгоград',
      'London': 'Лондон',
      'Paris': 'Париж',
      'Tokyo': 'Токио',
      'New York': 'Нью-Йорк',
      'Berlin': 'Берлин',
      'Kyiv': 'Киев',
      'Minsk': 'Минск',
      'Astana': 'Астана',
      'Beijing': 'Пекин',
      'Sydney': 'Сидней'
    };
    
    return cityMap[englishName] || englishName;
  };

  const handleFavoriteToggle = () => {
    if (isCityFavorite) {
      removeFavorite(data.name);
    } else {
      addFavorite(data.name, data.sys.country);
    }
  };

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

  return (
    <Card className="p-6 animate-fade-in hover-lift">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">
          {t.headers.currentWeather} в {translateCityName(data.name)}, {data.sys.country}
        </h2>
        <button
          onClick={handleFavoriteToggle}
          className={`p-2 rounded-full transition-all duration-300 text-2xl smooth-transition ${
            isCityFavorite 
              ? 'text-yellow-500 hover:bg-yellow-50 hover:scale-110' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500 hover:scale-110'
          }`}
          title={isCityFavorite ? t.buttons.removeFromFavorites : t.buttons.addToFavorites}
        >
          {isCityFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center animate-scale-in">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <img 
              src={getWeatherIcon(data.weather[0].icon)} 
              alt={data.weather[0].description}
              className="w-24 h-24"
            />
          </div>
          <div className="ml-4">
            <div className="text-6xl font-bold animate-fade-in">
              {Math.round(data.main.temp)}
              <span className="text-4xl">{t.units.celsius}</span>
            </div>
            <div className="text-lg capitalize text-gray-600 animate-slide-in">
              {translateWeatherDescription(data.weather[0].description)}
            </div>
            <div className="text-gray-500 animate-fade-in">
              {t.weather.feelsLike} {Math.round(data.main.feels_like)}
              <span className="text-sm">{t.units.celsius}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <WeatherDetail 
            label={t.weather.humidity} 
            value={`${data.main.humidity}${t.units.percent}`} 
          />
          <WeatherDetail 
            label={t.weather.wind} 
            value={`${Math.round(data.wind.speed)} ${t.units.metersPerSecond}`} 
          />
          <WeatherDetail 
            label={t.weather.pressure} 
            value={`${data.main.pressure} ${t.units.hectopascal}`} 
          />
          <WeatherDetail 
            label={t.weather.visibility} 
            value={`${(data.visibility / 1000).toFixed(1)} ${t.units.kilometers}`} 
          />
        </div>
      </div>
      
      {/* Строка с атрибуцией */}
      <div className="text-xs text-gray-400 text-center mt-4 animate-fade-in">
        Данные предоставлены OpenWeatherMap
      </div>
    </Card>
  );
};

// Вспомогательный компонент для отображения деталей погоды
const WeatherDetail = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg smooth-transition hover:bg-gray-100 hover-lift">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default CurrentWeather;
