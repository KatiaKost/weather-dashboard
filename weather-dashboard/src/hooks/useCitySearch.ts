import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

// Популярные города для автодополнения
const POPULAR_CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Лондон', 'Париж', 'Токио', 'Нью-Йорк', 'Берлин',
  'Киев', 'Минск', 'Астана', 'Пекин', 'Сидней'
];

export const useCitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Генерация подсказок
  useEffect(() => {
    if (debouncedSearchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = POPULAR_CITIES.filter(city =>
      city.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [debouncedSearchTerm]);

  const handleSearch = (city: string) => {
    setSelectedCity(city);
    setSearchTerm(city);
    setSuggestions([]);
  };

  const handleSuggestionClick = (city: string) => {
    handleSearch(city);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSuggestions([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    selectedCity,
    handleSearch,
    handleSuggestionClick,
    clearSearch,
  };
};