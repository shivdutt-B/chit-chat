"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, MoreVertical, Magnet, Star } from "lucide-react";
import type { Message, SmartReply } from "../../types";
import { mockSmartReplies, mockThreadSummary } from "../../data/mockData";
import { Paperclip, MessageSquare, Phone, Video, Smile } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  chatName: string;
  chatAvatar: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  chatName,
  chatAvatar,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-card bg-gray-50 m-1 rounded-lg">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={chatAvatar || "/placeholder.svg"}
              alt={chatName}
              className="w-10 h-10 rounded-full object-cover ring-background shadow-sm"
            />
            {/* <div className="absolute bottom-0 right-0 w-3 h-3"></div> */}
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-card-foreground font-heading">
              {chatName}
            </h2>
            {/* <p className="text-sm text-gray-500">Active now</p> */}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
            <Video className="w-5 h-5" />
          </button>
          {/* <button
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            onClick={() => setShowSummary(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Summary
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MoreVertical className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin bg-gray-50 m-1 rounded-lg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
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
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 px-6 py-4 bg-gray-50 m-1 rounded-lg">
        <div className="flex space-x-2 flex-shrink-0  py-2">
  <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
    <button
      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
      onClick={() => setShowSummary(true)}
    >
      <MessageSquare className="w-4 h-4 mr-2 text-white" />
      Summarize
    </button>
  </div>

  <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
    <button
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors duration-200"
      onClick={() => setShowSummary(true)}
    >
      <Star className="w-4 h-4 mr-2 text-gray-800" />
      Smart Reply
    </button>
  </div>
</div>

        <div className="flex space-x-3 items-center">
          {/* <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200">
            <Paperclip className="w-5 h-5" />
          </button> */}

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[44px] max-h-32"
              rows={1}
            />
            <button className="absolute right-3 top-[9px] transform p-1 text-gray-400 hover:text-primary-500 transition-colors duration-200">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-muted text-muted-foreground cursor-not-allowed text-gray-400"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setShowSummary(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popover rounded-2xl shadow-2xl max-w-2xl w-[90%] max-h-[80vh] overflow-hidden z-50 border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-popover-foreground font-heading">
                Conversation Summary
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-96">
              <pre className="whitespace-pre-wrap text-sm text-popover-foreground leading-relaxed">
                {mockThreadSummary}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-200"
                onClick={() => setShowSummary(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
