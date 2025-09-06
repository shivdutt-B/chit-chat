import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSearchChange('');
    }
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="relative lg:block hidden">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-2 lg:py-3 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-blue-500 transition-all duration-200"
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  );
};
