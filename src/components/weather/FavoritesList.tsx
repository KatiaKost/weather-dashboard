import { Card } from '../ui/Card';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';


interface FavoritesListProps {
  onCitySelect: (city: string) => void;
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
    'Sochi': 'Сочи',
    'Istanbul': 'Стамбул',
    'Dubai': 'Дубай',
    'Rome': 'Рим',
    'Madrid': 'Мадрид',
  };
  
  return cityMap[englishName] || englishName;
};

// Функция для получения флага страны
const getCountryFlag = (countryCode: string): string => {
  const flagMap: { [key: string]: string } = {
    'RU': '🇷🇺',
    'GB': '🇬🇧',
    'FR': '🇫🇷',
    'JP': '🇯🇵',
    'US': '🇺🇸',
    'DE': '🇩🇪',
    'UA': '🇺🇦',
    'BY': '🇧🇾',
    'KZ': '🇰🇿',
    'CN': '🇨🇳',
    'AU': '🇦🇺',
    'TR': '🇹🇷',
    'AE': '🇦🇪',
    'IT': '🇮🇹',
    'ES': '🇪🇸',
  };
  
  return flagMap[countryCode] || '🌍';
};

export const FavoritesList = ({ onCitySelect }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavoritesStore();
  const t = useTranslation();
  const [removingCity, setRemovingCity] = useState<string | null>(null);

  // Сортируем по времени добавления (новые сверху)
  const sortedFavorites = [...favorites].sort((a, b) => b.timestamp - a.timestamp);

  const handleRemove = (cityName: string) => {
    setRemovingCity(cityName);
    // Анимация удаления
    setTimeout(() => {
      removeFavorite(cityName);
      setRemovingCity(null);
    }, 300);
  };

  const handleCityClick = (cityName: string) => {
    if (removingCity !== cityName) {
      onCitySelect(cityName);
    }
  };

  // Пустое состояние
  if (favorites.length === 0) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-full mb-6">
            <span className="text-3xl">⭐</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            {t.headers.favorites}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {t.descriptions.noFavorites}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-yellow-500 text-lg">💡</span>
              <span>
                Нажмите на звездочку <span className="text-yellow-500">☆</span> рядом с названием города, чтобы добавить его в избранное
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {t.headers.favorites}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Быстрый доступ к вашим городам
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {favorites.length} {favorites.length === 1 ? 'город' : 
                favorites.length > 1 && favorites.length < 5 ? 'города' : 'городов'}
            </span>
          </div>
          
          {favorites.length > 4 && (
            <button
              onClick={() => {
                if (confirm('Удалить все города из избранного?')) {
                  favorites.forEach(fav => removeFavorite(fav.name));
                }
              }}
              className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Очистить все
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {sortedFavorites.map((favorite) => {
          const isRemoving = removingCity === favorite.name;
          const cityName = translateCityName(favorite.name);
          
          return (
            <div
              key={`${favorite.name}-${favorite.timestamp}`}
              className={`
                relative group rounded-xl overflow-hidden transition-all duration-300
                ${isRemoving 
                  ? 'opacity-0 scale-95' 
                  : 'opacity-100 scale-100 hover:scale-[1.02]'
                }
              `}
            >
              {/* Фоновая карточка */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" />
              
              {/* Контент */}
              <div className="relative p-4">
                <button
                  onClick={() => handleCityClick(favorite.name)}
                  className="w-full text-left group-hover:translate-x-1 transition-transform duration-300"
                  disabled={isRemoving}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getCountryFlag(favorite.country)}
                      </span>
                    </div>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(favorite.timestamp).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {cityName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {favorite.name !== cityName ? favorite.name : ''}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-blue-500">📍</span>
                      <span>Выбрать</span>
                    </span>
                  </div>
                </button>
                
                {/* Кнопка удаления */}
                <button
                  onClick={() => handleRemove(favorite.name)}
                  disabled={isRemoving}
                  className={`
                    absolute top-3 right-3 p-2 rounded-full transition-all duration-300
                    ${isRemoving 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-90' 
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100'
                    }
                    backdrop-blur-sm
                  `}
                  title={t.buttons.removeFromFavorites}
                  aria-label={`Удалить ${cityName} из избранного`}
                >
                  {isRemoving ? (
                    <span className="animate-spin block w-4 h-4">⟳</span>
                  ) : (
                    <span className="text-lg leading-none">×</span>
                  )}
                </button>
              </div>
              
              {/* Индикатор наведения */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 rounded-xl pointer-events-none transition-colors duration-300" />
            </div>
          );
        })}
        
        {/* Карточка для добавления нового */}
        <button
          onClick={() => {
            const city = prompt('Введите название города для добавления в избранное:');
            if (city && city.trim()) {
              onCitySelect(city.trim());
            }
          }}
          className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors" />
          
          <div className="relative p-6 flex flex-col items-center justify-center min-h-[120px]">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">+</span>
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              Добавить город
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              Нажмите чтобы добавить
            </div>
          </div>
        </button>
      </div>
      
      {/* Подсказка */}
      {favorites.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-green-500">💡</span>
              <span>
                Нажмите на город для быстрого просмотра погоды
              </span>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Автосохранение в localStorage
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FavoritesList;