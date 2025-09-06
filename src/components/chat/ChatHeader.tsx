import React from 'react';
import { Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  chatAvatar,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-card bg-gray-50 m-1 rounded-lg">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={chatAvatar || "/placeholder.svg"}
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover ring-background shadow-sm"
          />
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-card-foreground font-heading">
            {chatName}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
          <Video className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
