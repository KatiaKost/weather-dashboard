import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useDebounce } from '../../hooks/useDebounce'; 
import { useTranslation } from '../../hooks/useTranslation';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const t = useTranslation();

  // Автопоиск при изменении debounced значения
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      onSearch(debouncedSearchTerm.trim());
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input 
        placeholder={t.descriptions.searchPlaceholder}
        className="flex-1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? t.buttons.searching : t.buttons.search}
      </Button>
    </form>
  );
};

export default SearchBar;