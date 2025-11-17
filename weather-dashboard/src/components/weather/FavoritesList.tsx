import { Card } from '../ui/Card';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useTranslation } from '../../hooks/useTranslation';

interface FavoritesListProps {
  onCitySelect: (city: string) => void;
}

export const FavoritesList = ({ onCitySelect }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavoritesStore();
  const t = useTranslation();

  if (favorites.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{t.headers.favorites}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {favorites.map((favorite) => (
          <div
            key={`${favorite.name}-${favorite.timestamp}`}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <button
              onClick={() => onCitySelect(favorite.name)}
              className="flex-1 text-left hover:text-blue-600 transition-colors"
            >
              <div className="font-medium">{favorite.name}</div>
              <div className="text-sm text-gray-500">{favorite.country}</div>
            </button>
            <button
              onClick={() => removeFavorite(favorite.name)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              title={t.buttons.removeFromFavorites}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};