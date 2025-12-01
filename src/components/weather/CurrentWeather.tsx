import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavoritesStore } from '../../stores/favoritesStore';
import type { CurrentWeather as CurrentWeatherType } from '../../types/weather';
import { useState } from 'react';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

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
    'Sydney': 'Сидней',
    'Sochi': 'Сочи'
  };
  
  return cityMap[englishName] || englishName;
};

// Функция для перевода описания погоды
const translateWeatherDescription = (description: string) => {
  const descriptionMap: { [key: string]: string } = {
    'clear sky': 'ясно',
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
    'rain': 'дождь',
    'snow': 'снег',
    'thunderstorm': 'гроза',
    'mist': 'туман',
    'smoke': 'дымка',
    'haze': 'мгла',
    'fog': 'туман',
  };

  return descriptionMap[description] || description;
};

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const t = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isCityFavorite = isFavorite(data.name);
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteToggle = () => {
    if (isCityFavorite) {
      removeFavorite(data.name);
    } else {
      addFavorite(data.name, data.sys.country);
    }
  };

  // Получение иконки погоды
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  // Определение времени суток для фона
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'утро';
    if (hour >= 12 && hour < 18) return 'день';
    if (hour >= 18 && hour < 22) return 'вечер';
    return 'ночь';
  };

  return (
    <Card className="overflow-hidden card-hover">
      {/* Верхняя часть с градиентом */}
      <div className={`relative p-6 ${
        data.weather[0].main === 'Clear' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
        data.weather[0].main === 'Clouds' ? 'bg-gradient-to-r from-gray-600 to-gray-400' :
        data.weather[0].main === 'Rain' ? 'bg-gradient-to-r from-blue-700 to-blue-500' :
        data.weather[0].main === 'Snow' ? 'bg-gradient-to-r from-blue-300 to-blue-100' :
        'bg-gradient-to-r from-purple-600 to-pink-500'
      } text-white`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                {translateCityName(data.name)}, {data.sys.country}
              </h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                {getTimeOfDay()}
              </span>
            </div>
            <p className="text-lg opacity-90">
              {translateWeatherDescription(data.weather[0].description)}
            </p>
          </div>
          
          <button
            onClick={handleFavoriteToggle}
            className={`p-3 rounded-full transition-all duration-300 ${
              isCityFavorite 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}
            title={isCityFavorite ? t.buttons.removeFromFavorites : t.buttons.addToFavorites}
          >
            <span className="text-2xl">
              {isCityFavorite ? '★' : '☆'}
            </span>
          </button>
        </div>
        
        {/* Основная температура */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative float-animation">
              <img 
                src={getWeatherIcon(data.weather[0].icon)} 
                alt={data.weather[0].description}
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold">
                {Math.round(data.main.temp)}°
              </div>
              <div className="text-xl mt-2 opacity-90">
                Ощущается как {Math.round(data.main.feels_like)}°
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-80 mb-2">Обновлено только что</div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              {showDetails ? 'Скрыть детали' : 'Показать детали'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Детальная информация */}
      {showDetails && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Детали погоды</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherDetail 
              icon="💧"
              label="Влажность"
              value={`${data.main.humidity}%`}
              description="Относительная влажность воздуха"
            />
            <WeatherDetail 
              icon="💨"
              label="Ветер"
              value={`${Math.round(data.wind.speed)} м/с`}
              description="Скорость ветра у поверхности"
            />
            <WeatherDetail 
              icon="📊"
              label="Давление"
              value={`${data.main.pressure} гПа`}
              description="Атмосферное давление"
            />
            <WeatherDetail 
              icon="👁️"
              label="Видимость"
              value={`${(data.visibility / 1000).toFixed(1)} км`}
              description="Дальность видимости"
            />
          </div>
        </div>
      )}
      
      {/* Быстрые метрики */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(data.main.temp_max)}°
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Максимум
            </div>
          </div>
          <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {Math.round(data.main.temp_min)}°
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Минимум
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.main.humidity}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Влажность
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(data.wind.speed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ветер, м/с
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Обновленный компонент WeatherDetail
const WeatherDetail = ({ icon, label, value, description }: { 
  icon: string; 
  label: string; 
  value: string;
  description?: string;
}) => (
  <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-medium text-gray-800 dark:text-gray-200">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
  </div>
);