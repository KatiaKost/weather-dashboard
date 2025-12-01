import { useState } from 'react';
import { Card } from './components/ui/Card';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { 
  SearchBar, 
  SearchSuggestions, 
  CurrentWeather, 
  ForecastList,
  EmptyState,
  FavoritesList 
} from './components/weather';
import { useWeather, useCitySearch, useTranslation } from './hooks';

function App() {
  const { searchTerm, setSearchTerm, suggestions, selectedCity, handleSuggestionClick } = useCitySearch();
  const { currentWeather, forecast, isLoading, isError, error } = useWeather(selectedCity);
  const t = useTranslation();
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  const handleSearch = (city: string) => {
    setFavoritesError(null);
    handleSuggestionClick(city);
  };

  const handleCitySelect = (city: string) => {
    setFavoritesError(null);
    try {
      handleSuggestionClick(city);
    } catch (error) {
      console.error('Error selecting favorite city:', error);
      setFavoritesError('Не удалось загрузить погоду для избранного города. Попробуйте еще раз.');
    }
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
            {/* Список избранных городов */}
            <FavoritesList onCitySelect={handleCitySelect} />

            {/* Ошибка избранного */}
            {favoritesError && (
              <Card className="p-4 bg-red-50 border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="text-red-700 text-sm">
                    {favoritesError}
                  </div>
                  <button
                    onClick={() => setFavoritesError(null)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>
              </Card>
            )}

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
                  onSuggestionClick={handleCitySelect}
                  visible={suggestions.length > 0 && searchTerm.length > 0}
                />
              </div>
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

            {/* Searching State */}
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