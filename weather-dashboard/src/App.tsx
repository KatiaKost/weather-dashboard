import { Card } from './components/ui/Card';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { 
  SearchBar, 
  SearchSuggestions, 
  CurrentWeather, 
  ForecastList,
  EmptyState 
} from './components/weather';
import { useWeather, useCitySearch, useTranslation } from './hooks';

function App() {
  const { searchTerm, setSearchTerm, suggestions, selectedCity, handleSuggestionClick } = useCitySearch();
  const { currentWeather, forecast, isLoading, isError, error } = useWeather(selectedCity);
  const t = useTranslation();

  const handleSearch = (city: string) => {
    // Устанавливаем выбранный город для поиска погоды
    handleSuggestionClick(city);
  };

  const handleInputChange = (value: string) => {
    // Только обновляем поисковый термин для подсказок
    setSearchTerm(value);
  };

  // Определяем состояния для отображения
  const showInitialState = !selectedCity && !isLoading && !searchTerm;
  const showSearchingState = searchTerm && !selectedCity && !isLoading && !isError;
  const showWeatherData = selectedCity && currentWeather && !isLoading && !isError;
  const showError = isError;

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
              {searchTerm && !selectedCity && suggestions.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Нажмите Enter для поиска или выберите город из списка выше
                </p>
              )}
            </Card>

            {/* Loading State */}
            {isLoading && (
              <Card className="p-6">
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner />
                  <span className="ml-4 text-gray-600">{t.common.loading}</span>
                </div>
              </Card>
            )}

            {/* Error State */}
            {showError && (
              <Card className="p-6">
                <div className="text-center py-4">
                  <div className="text-red-600 text-lg font-semibold mb-2">
                    {t.errors.apiError}
                  </div>
                  <div className="text-gray-600">
                    {error?.message || t.errors.unknownError}
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t.common.retry}
                  </button>
                </div>
              </Card>
            )}

            {/* Weather Data */}
            {showWeatherData && (
              <>
                <CurrentWeather data={currentWeather} />
                {forecast && <ForecastList data={forecast} />}
              </>
            )}

            {/* Searching State - показать подсказку */}
            {showSearchingState && (
              <EmptyState type="search" />
            )}

            {/* Initial State */}
            {showInitialState && (
              <EmptyState type="initial" />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;