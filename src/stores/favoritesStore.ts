import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteCity {
  name: string;
  country: string;
  timestamp: number;
}

interface FavoritesStore {
  favorites: FavoriteCity[];
  addFavorite: (city: string, country: string) => void;
  removeFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (name: string, country: string) => {
        set((state) => ({
          favorites: [
            ...state.favorites,
            { name, country, timestamp: Date.now() },
          ],
        }));
      },
      removeFavorite: (name: string) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.name !== name),
        }));
      },
      isFavorite: (name: string) => {
        return get().favorites.some((fav) => fav.name === name);
      },
    }),
    {
      name: 'weather-favorites',
    }
  )
);