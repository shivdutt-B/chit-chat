import React from 'react';
import { Phone, Video, ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  onBackToChats?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  chatAvatar,
  onBackToChats,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-4 bg-card bg-gray-50 m-1 rounded-lg">
      <div className="flex items-center">
        {/* Back button - only visible on mobile */}
        {onBackToChats && (
          <button
            onClick={onBackToChats}
            className="p-2 mr-2 md:hidden text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="relative hidden sm:block">
          <img
            src={chatAvatar || "/placeholder.svg"}
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover ring-background shadow-sm"
          />
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-card-foreground font-heading truncate">
            {chatName}
          </h2>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-1 md:space-x-2">
        <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
          <Video className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
