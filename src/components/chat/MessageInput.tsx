import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export interface MessageInputRef {
  setMessage: (message: string) => void;
  getMessage: () => string;
}

export const MessageInput = forwardRef<MessageInputRef, MessageInputProps>(({ onSendMessage }, ref) => {
  const [newMessage, setNewMessage] = useState("");

  useImperativeHandle(ref, () => ({
    setMessage: (message: string) => {
      setNewMessage(message);
    },
    getMessage: () => newMessage
  }));

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex space-x-2 md:space-x-3 items-center">
      <div className="flex-1 relative">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 text-sm bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[40px] md:min-h-[44px] max-h-32"
          rows={1}
        />
        <button className="absolute right-2 md:right-3 top-[6px] md:top-[9px] transform p-1 text-gray-400 hover:text-primary-500 transition-colors duration-200">
          <Smile className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!newMessage.trim()}
        className={`p-2 md:p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
          newMessage.trim()
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-muted text-muted-foreground cursor-not-allowed text-gray-400"
        }`}
      >
        <Send className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';
