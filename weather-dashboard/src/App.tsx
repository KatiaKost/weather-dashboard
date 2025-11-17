import { Card } from './components/ui/Card';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { SearchBar, SearchSuggestions } from './components/weather';
import { useWeather, useCitySearch, useTranslation } from './hooks';

function App() {
  const { searchTerm, setSearchTerm, suggestions, selectedCity, handleSuggestionClick } = useCitySearch();
  const { currentWeather, forecast, isLoading, isError, error } = useWeather(selectedCity);
  const t = useTranslation();

  const handleSearch = (city: string) => {
    setSearchTerm(city);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {t.headers.weatherDashboard}
          </h1>
          <p className="text-gray-600 mt-2">
            {t.descriptions.appDescription}
          </p>
        </header>
        
        <main>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Section */}
            <Card className="p-6 relative">
              <h2 className="text-xl font-semibold mb-4">{t.headers.searchCity}</h2>
              <div className="relative">
                <SearchBar 
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
                <SearchSuggestions
                  suggestions={suggestions}
                  onSuggestionClick={handleSuggestionClick}
                  visible={suggestions.length > 0 && searchTerm.length > 0}
                />
              </div>
              {searchTerm && !selectedCity && (
                <p className="text-sm text-gray-500 mt-2">
                  Начните вводить название города для поиска...
                </p>
              )}
            </Card>

            {/* Weather Display */}
            {isLoading && (
              <Card className="p-6">
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner />
                  <span className="ml-4 text-gray-600">{t.common.loading}</span>
                </div>
              </Card>
            )}

            {isError && (
              <Card className="p-6">
                <div className="text-center py-4">
                  <div className="text-red-600 text-lg font-semibold mb-2">
                    {t.errors.apiError}
                  </div>
                  <div className="text-gray-600">
                    {error instanceof Error ? error.message : t.errors.unknownError}
                  </div>
                </div>
              </Card>
            )}

            {currentWeather && !isLoading && (
              <>
                {/* Current Weather */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {t.headers.currentWeather} в {translateCityName(currentWeather.name)}, {currentWeather.sys.country}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <div>
                        <img 
                          src={getWeatherIcon(currentWeather.weather[0].icon)} 
                          alt={currentWeather.weather[0].description}
                          className="w-24 h-24"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-6xl font-bold">
                          {Math.round(currentWeather.main.temp)}
                          <span className="text-4xl">{t.units.celsius}</span>
                        </div>
                        <div className="text-lg capitalize text-gray-600">
                          {translateWeatherDescription(currentWeather.weather[0].description)}
                        </div>
                        <div className="text-gray-500">
                          {t.weather.feelsLike} {Math.round(currentWeather.main.feels_like)}
                          <span className="text-sm">{t.units.celsius}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <WeatherDetail 
                        label={t.weather.humidity} 
                        value={`${currentWeather.main.humidity}${t.units.percent}`} 
                      />
                      <WeatherDetail 
                        label={t.weather.wind} 
                        value={`${currentWeather.wind.speed} ${t.units.metersPerSecond}`} 
                      />
                      <WeatherDetail 
                        label={t.weather.pressure} 
                        value={`${currentWeather.main.pressure} ${t.units.hectopascal}`} 
                      />
                      <WeatherDetail 
                        label={t.weather.visibility} 
                        value={`${(currentWeather.visibility / 1000).toFixed(1)} ${t.units.kilometers}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Строка с атрибуцией */}
                  <div className="text-xs text-gray-400 text-center mt-4">
                    Данные предоставлены OpenWeatherMap
                  </div>
                </Card>

                {/* 5-Day Forecast */}
                {forecast && (
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{t.headers.fiveDayForecast}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((day, index) => (
                        <div key={day.dt} className="text-center p-4 bg-gray-50 rounded-lg">
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
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {!currentWeather && !isLoading && !isError && searchTerm && !selectedCity && (
              <Card className="p-6">
                <div className="text-center text-gray-500 py-8">
                  Нажмите Enter или выберите город из списка для поиска погоды
                </div>
              </Card>
            )}

            {!searchTerm && !isLoading && !isError && (
              <Card className="p-6">
                <div className="text-center text-gray-500 py-8">
                  {t.descriptions.enterCity}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Вспомогательный компонент для отображения деталей погоды
const WeatherDetail = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default App;