import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');
  const t = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    const validCities = ['москва', 'лондон', 'париж', 'токио', 'нью-йорк', 'берлин', 
      'казань', 'новосибирск', 'киев', 'сочи', 'санкт-петербург'];

    const isCityValid = validCities.some(city => 
      trimmedValue.toLowerCase().includes(city)
    );
    
    if (!isCityValid) {
      alert('Пожалуйста, введите существующий город. Например: Москва, Лондон, Париж');
      return;
    }
    
    onSearch(trimmedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Input 
          placeholder={t.descriptions.searchPlaceholder}
          className="pl-10 pr-4 py-3 text-base rounded-xl"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
        className="px-6 py-3 rounded-xl text-base font-medium"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⟳</span>
            {t.buttons.searching}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            🌤️ {t.buttons.search}
          </span>
        )}
      </Button>
    </form>
  );
};

export default SearchBar;