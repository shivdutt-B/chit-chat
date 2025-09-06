import React from 'react';
import { format } from 'date-fns';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-end space-x-2 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md ${
          message.isOwn ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {!message.isOwn && message.avatar && (
          <img
            src={message.avatar || "/placeholder.svg"}
            alt={message.sender}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div
          className={`group relative px-4 py-3 rounded-2xl shadow-sm ${
            message.isOwn
              ? "bg-accent text-accent-foreground bg-pink-500 text-white border border-border"
              : "text-white bg-blue-500 text-card-foreground border border-border"
          }`}
        >
          {!message.isOwn && (
            <div className="text-xs font-medium text-white mb-1">
              {message.sender}
            </div>
          )}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          <div
            className={`text-xs mt-1 ${
              message.isOwn ? "text-primary-100" : "text-white"
            }`}
          >
            {format(new Date(message.timestamp), "HH:mm")}
          </div>
        </div>
      </div>
    </div>
  );
};
