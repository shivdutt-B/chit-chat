import React from 'react';
import { Star } from 'lucide-react';
import { mockSmartReplies } from '../../data/mockData';

interface SmartRepliesDropdownProps {
  isVisible: boolean;
  onSelectReply: (reply: string) => void;
}

export const SmartRepliesDropdown: React.FC<SmartRepliesDropdownProps> = ({
  isVisible,
  onSelectReply,
}) => {
  if (!isVisible) return null;

  return (
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
            onClick={() => onSelectReply(reply.content)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
          >
            <div className="text-sm text-gray-900 mb-1">{reply.content}</div>
            <div className="text-xs text-gray-500">{reply.context}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
