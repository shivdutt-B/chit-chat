import React, { useState, useEffect } from 'react';
import { Star, Loader2, RefreshCw } from 'lucide-react';
import { generateSmartReplies, type SmartReply } from '../../utils/geminiApi';
import type { Message } from '../../types';

interface SmartRepliesDropdownProps {
  isVisible: boolean;
  messages: Message[];
  chatName: string;
  onSelectReply: (reply: string) => void;
}

export const SmartRepliesDropdown: React.FC<SmartRepliesDropdownProps> = ({
  isVisible,
  messages,
  chatName,
  onSelectReply,
}) => {
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      generateReplies();
    }
  }, [isVisible, messages, chatName]);

  const generateReplies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedReplies = await generateSmartReplies(messages, chatName);
      setReplies(generatedReplies);
    } catch (err) {
      setError('Failed to generate smart replies. Please try again.');
      // Set fallback replies
      setReplies([
        { id: 1, content: "Thanks!", context: "Quick acknowledgment", type: "quick" },
        { id: 2, content: "Sounds good", context: "Positive response", type: "quick" },
        { id: 3, content: "I'll think about it", context: "Thoughtful reply", type: "detailed" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if this is a follow-up scenario (user is only sender)
  const isFollowUpScenario = messages.length > 0 && messages.every(msg => msg.isOwn);
  const headerTitle = isFollowUpScenario ? "Smart Follow-ups" : "Smart Replies";
  const headerSubtitle = isFollowUpScenario ? "Continue the conversation" : "Respond to messages";

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-16 md:bottom-20 left-2 right-2 md:left-6 md:right-6 bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 z-40 max-w-sm md:max-w-md smart-replies-container">
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg md:rounded-t-xl">
        <h3 className="text-xs md:text-sm font-semibold text-gray-900 flex items-center truncate">
          <Star className="w-3 h-3 md:w-4 md:h-4 mr-2 text-yellow-500 flex-shrink-0" />
          <span className="truncate">{headerTitle}</span>
          {!isLoading && !error && (
            <span className="ml-1 md:ml-2 text-xs text-gray-500 hidden sm:inline">• {headerSubtitle}</span>
          )}
        </h3>
        {!isLoading && (
          <button
            onClick={generateReplies}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200 flex-shrink-0"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="py-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
            <span className="text-sm text-gray-600">
              {isFollowUpScenario 
                ? 'Generating follow-up suggestions...' 
                : 'Generating smart replies...'
              }
            </span>
          </div>
        ) : error ? (
          <div className="px-4 py-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm mb-2">{error}</p>
              <button 
                onClick={generateReplies}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          replies.map((reply, index) => (
            <button
              key={reply.id || index}
              onClick={() => onSelectReply(reply.content)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-2">
                  <div className="text-sm text-gray-900 mb-1 group-hover:text-blue-600">
                    {reply.content}
                  </div>
                  <div className="text-xs text-gray-500">{reply.context}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    reply.type === 'quick' ? 'bg-green-100 text-green-700' :
                    reply.type === 'question' ? 'bg-blue-100 text-blue-700' :
                    reply.type === 'detailed' ? 'bg-purple-100 text-purple-700' :
                    reply.type === 'followup' ? 'bg-orange-100 text-orange-700' :
                    reply.type === 'acknowledgment' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {reply.type}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
