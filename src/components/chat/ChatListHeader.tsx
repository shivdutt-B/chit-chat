import React from 'react';
import { Plus } from 'lucide-react';

interface ChatListHeaderProps {
  totalChats: number;
  filteredChats: number;
  searchQuery: string;
  onNewChatClick: () => void;
}

export const ChatListHeader: React.FC<ChatListHeaderProps> = ({
  totalChats,
  filteredChats,
  searchQuery,
  onNewChatClick,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
      <div className="min-w-0 flex-1">
        {/* Hide text on small/medium screens, show on large */}
        <h1 className="hidden lg:block text-xl lg:text-2xl font-bold text-sidebar-primary-foreground font-heading truncate">Messages</h1>
        <p className="hidden lg:block text-xs lg:text-sm text-muted-foreground mt-1">
          {searchQuery ? `${filteredChats} of ${totalChats}` : totalChats} conversations
        </p>
      </div>
      
      {/* New Chat Button - centered on small screens */}
      <button 
        onClick={onNewChatClick}
        className="group cursor-pointer transition-all duration-200 text-white hover:text-white hover:bg-green-600 rounded-xl bg-green-500 font-medium shadow-sm hover:shadow-md flex-shrink-0 
        w-10 h-10 lg:w-auto lg:h-auto lg:px-4 lg:py-2 
        flex items-center justify-center lg:justify-start
        text-xs lg:text-sm
        mx-auto lg:mx-0 lg:ml-2"
        title="New Chat"
      >
        <Plus className="w-4 h-4 lg:mr-1" />
        <span className="hidden lg:inline">New Chat</span>
      </button>
    </div>
  );
};
