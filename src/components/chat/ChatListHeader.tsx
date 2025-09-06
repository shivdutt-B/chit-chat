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
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-sidebar-primary-foreground font-heading">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {searchQuery ? `${filteredChats} of ${totalChats}` : totalChats} conversations
        </p>
      </div>
      <button 
        onClick={onNewChatClick}
        className="group px-4 cursor-pointer py-2 text-white hover:text-white hover:bg-green-600 rounded-xl transition-all duration-200 w-auto text-sm bg-green-500 font-medium shadow-sm hover:shadow-md"
      >
        <Plus className="w-4 h-4 inline mr-1" />
        New Chat
      </button>
    </div>
  );
};
