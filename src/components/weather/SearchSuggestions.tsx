import { useTranslation } from '../../hooks/useTranslation';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (city: string) => void;
  visible: boolean;
}

export const SearchSuggestions = ({ 
  suggestions, 
  onSuggestionClick, 
  visible 
}: SearchSuggestionsProps) => {
  const t = useTranslation();

  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-md last:rounded-b-md"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

// Явно экспортируем по умолчанию
export default SearchSuggestions;