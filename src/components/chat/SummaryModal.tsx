import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, X } from 'lucide-react';
import { mockThreadSummary } from '../../data/mockData';

interface SummaryModalProps {
  isVisible: boolean;
  chatName: string;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isVisible,
  chatName,
  onClose,
}) => {
  if (!isVisible) return null;

  const copySummary = () => {
    navigator.clipboard.writeText(mockThreadSummary);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
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
              onClick={onClose}
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
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                onClick={copySummary}
              >
                Copy Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
