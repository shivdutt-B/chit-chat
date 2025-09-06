import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Search className="w-12 h-12 text-gray-300 mb-3" />
      <p className="text-sm text-gray-500 font-medium">No conversations found</p>
      <p className="text-xs text-gray-400 mt-1">
        {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
      </p>
    </div>
  );
};
