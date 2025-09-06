"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, Star, X } from "lucide-react";
import type { Message} from "../../types";
import { mockSmartReplies, mockThreadSummary } from "../../data/mockData";
import { MessageSquare, Phone, Video, Smile } from "lucide-react";

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
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSmartReplies) {
        const target = event.target as HTMLElement;
        if (!target.closest('.smart-replies-container')) {
          setShowSmartReplies(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSmartReplies]);

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

  const closeSummary = () => {
    setShowSummary(false);
  };

  const handleSmartReply = () => {
    // Toggle showing smart reply options
    setShowSmartReplies(!showSmartReplies);
  };

  const selectSmartReply = (reply: string) => {
    setNewMessage(reply);
    setShowSmartReplies(false);
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
        <div className="flex space-x-2 flex-shrink-0 py-2">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
              onClick={() => setShowSummary(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2 text-white" />
              Summarize
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 smart-replies-container">
            <button
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors duration-200"
              onClick={handleSmartReply}
            >
              <Star className="w-4 h-4 mr-2 text-gray-800" />
              Smart Reply
            </button>
          </div>
        </div>

        <div className="flex space-x-3 items-center">
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

      {/* Smart Replies Dropdown */}
      {showSmartReplies && (
        <div className="absolute bottom-20 left-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 z-40 max-w-md smart-replies-container">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Smart Replies
            </h3>
          </div>
          <div className="py-2">
            {mockSmartReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => selectSmartReply(reply.content)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm text-gray-900 mb-1">{reply.content}</div>
                <div className="text-xs text-gray-500">{reply.context}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={closeSummary}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Conversation Summary
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      AI-generated summary of your chat with {chatName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSummary}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed">
                    {typeof mockThreadSummary === 'string' ? (
                      mockThreadSummary.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph.trim()}
                          </p>
                        ) : null
                      ))
                    ) : (
                      <div className="text-gray-500 italic text-center py-8">
                        No summary available for this conversation.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Summary generated on {format(new Date(), 'MMM dd, yyyy')}
                </div>
                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    onClick={closeSummary}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      // Add copy to clipboard functionality here
                      navigator.clipboard.writeText(mockThreadSummary);
                    }}
                  >
                    Copy Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};