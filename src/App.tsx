import { useState, useEffect } from 'react';
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
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  const { searchTerm, setSearchTerm, suggestions, selectedCity, handleSuggestionClick } = useCitySearch();
  const { currentWeather, forecast, isLoading, isError, error } = useWeather(selectedCity);
  const t = useTranslation();
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Автоматическое определение темы
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <Card className="p-6 m-4">
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Что-то пошло не так
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error.message}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Пожалуйста, попробуйте обновить страницу
        </div>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌤️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t.headers.weatherDashboard}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.descriptions.appDescription}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Переключатель темы */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              {/* GitHub ссылка */}
              <a
                href="https://github.com/KatiaKost/weather-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub репозиторий"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Избранное - только на больших экранах */}
          <div className="hidden lg:block">
            <FavoritesList onCitySelect={handleCitySelect} />
          </div>

          {/* Основной поиск */}
          <Card className="p-5 sm:p-6 card-hover">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  {t.headers.searchCity}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Введите город для просмотра погоды
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Москва</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Лондон</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">Токио</span>
              </div>
            </div>
            
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

          {/* Избранное для мобильных */}
          <div className="lg:hidden">
            <FavoritesList onCitySelect={handleCitySelect} />
          </div>

          {/* Состояния загрузки/ошибок */}
          {isLoading && (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner />
                <span className="mt-4 text-gray-600 dark:text-gray-300">
                  {t.common.loading} погоду для {selectedCity}...
                </span>
              </div>
            </Card>
          )}

          {isError && (
            <Card className="p-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-start gap-4">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    {t.errors.apiError}
                  </h3>
                  <p className="text-red-600 dark:text-red-300 mt-1">
                    {error?.message || t.errors.unknownError}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Используем демо-данные для показа погоды
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Данные о погоде */}
          {currentWeather && !isLoading && !isError && (
            <>
              <CurrentWeather data={currentWeather} />
              {forecast && <ForecastList data={forecast} />}
            </>
          )}

          {/* Начальное состояние */}
          {!selectedCity && !isLoading && !searchTerm && !isError && (
            <EmptyState type="initial" />
          )}

          {/* Состояние поиска */}
          {searchTerm && !selectedCity && !isLoading && !isError && (
            <EmptyState type="search" />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-8 pb-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-2xl">🌤️</span>
                <span className="text-lg font-semibold">Weather Dashboard</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Демо-приложение с использованием React, TypeScript и Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;