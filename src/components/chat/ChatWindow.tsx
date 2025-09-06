import type React from "react";
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Star } from "lucide-react";
import type { Message} from "../../types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput, type MessageInputRef } from "./MessageInput";
import { SmartRepliesDropdown } from "./SmartRepliesDropdown";
import { SummaryModal } from "./SummaryModal";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  chatName: string;
  chatAvatar: string;
  onBackToChats?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  chatName,
  chatAvatar,
  onBackToChats,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const messageInputRef = useRef<MessageInputRef>(null);

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

  const handleSmartReply = () => {
    setShowSmartReplies(!showSmartReplies);
  };

  const selectSmartReply = (reply: string) => {
    // Inject the reply into the input field instead of sending directly
    if (messageInputRef.current) {
      messageInputRef.current.setMessage(reply);
    }
    setShowSmartReplies(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader chatName={chatName} chatAvatar={chatAvatar} onBackToChats={onBackToChats} />
      
      <MessageList messages={messages} />

      {/* Input Container */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-gray-50 m-1 rounded-lg">
        <div className="flex space-x-2 flex-shrink-0 py-2 flex-wrap">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer"
              onClick={() => setShowSummary(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2 text-white" />
              Summarize
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 smart-replies-container">
            <button
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer"
              onClick={handleSmartReply}
            >
              <Star className="w-4 h-4 mr-2 text-gray-800" />
              Smart Reply
            </button>
          </div>
        </div>

        <MessageInput ref={messageInputRef} onSendMessage={onSendMessage} />
      </div>

      <SmartRepliesDropdown
        isVisible={showSmartReplies}
        messages={messages}
        chatName={chatName}
        onSelectReply={selectSmartReply}
      />

      <SummaryModal
        isVisible={showSummary}
        chatName={chatName}
        messages={messages}
        onClose={() => setShowSummary(false)}
      />
    </div>
  );
};