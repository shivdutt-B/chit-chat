import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Users } from 'lucide-react';
import type { Chat } from '../../types';

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick: () => void;
  searchQuery?: string;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ 
  chat, 
  isActive, 
  onClick, 
  searchQuery 
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  // Function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-gray-900 font-medium rounded px-0.5">
          {part}
        </span>
      ) : part
    );
  };

  // Mock unread count for demonstration - use chat.id to make it consistent
  const unreadCount = parseInt(chat.id) % 4; // This will give consistent values (0-3) based on chat ID
  const hasUnread = unreadCount > 0;

  return (
    <div
      className={`m-1 rounded-lg group relative flex items-center px-4 py-4 cursor-pointer transition-all duration-200 ${
        isActive 
          ? "bg-blue-500 text-white shadow-lg" 
          : "bg-transparent hover:bg-gray-100 border-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
            isActive ? "ring-2 ring-white/30" : ""
          } shadow-sm`}
        >
          <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} className="w-full h-full object-cover" />
        </div>

        {chat.isGroup && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-green-500">
            <Users className="w-2.5 h-2.5 text-accent-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-medium text-sm truncate transition-colors duration-200 ${
              isActive ? "text-white" : "text-gray-900"
            }`}
            style={isActive ? { color: 'white' } : {}}
          >
            {highlightText(chat.name, searchQuery || '')}
          </h3>
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            <span
              className={`text-xs transition-colors duration-200 ${
                isActive ? "text-white/90" : "text-gray-500"
              }`}
              style={isActive ? { color: 'rgba(255, 255, 255, 0.9)' } : {}}
            >
              {formatTime(chat.timestamp)}
            </span>
              {hasUnread && (
                <div className={`w-5 h-5 text-xs font-medium rounded-full flex items-center justify-center ${
                  isActive 
                    ? "bg-white text-blue-600" 
                    : "bg-blue-500 text-white"
                }`}>
                  {unreadCount}
                </div>
              )}
          </div>
        </div>

        <p
          className={`text-xs truncate leading-relaxed transition-colors duration-200 ${
            isActive
              ? "text-white/90 font-medium"
              : hasUnread 
                ? "text-gray-900 font-medium" 
                : "text-gray-600"
          }`}
          style={isActive ? { color: 'rgba(255, 255, 255, 0.9)' } : {}}
        >
          {highlightText(chat.lastMessage, searchQuery || '')}
        </p>
      </div>
    </div>
  );
};
