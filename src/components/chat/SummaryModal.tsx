import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquare, X, Loader2, Copy, RefreshCw } from 'lucide-react';
import { generateConversationSummary } from '../../utils/geminiApi';
import type { Message } from '../../types';

interface SummaryModalProps {
  isVisible: boolean;
  chatName: string;
  messages: Message[];
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isVisible,
  chatName,
  messages,
  onClose,
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && messages.length > 0) {
      generateSummary();
    }
  }, [isVisible, messages, chatName]);

  const generateSummary = async () => {
    if (messages.length === 0) {
      setSummary('No messages to summarize.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const generatedSummary = await generateConversationSummary(messages, chatName);
      setTimeout(() => {
        // safe update state after delay.
        setSummary(generatedSummary);
      }, 1500);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      setSummary('');
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = async () => {
    if (summary) {
      try {
        await navigator.clipboard.writeText(summary);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy summary:', err);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                  Conversation Summary
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">
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
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  <span className="text-gray-600 font-medium">Generating AI summary...</span>
                  <span className="text-gray-400 text-sm mt-1">Analyzing {messages.length} messages</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button 
                      onClick={generateSummary}
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold text-blue-700 mb-3 mt-5 first:mt-0">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4 first:mt-0">{children}</h3>,
                      p: ({children}) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-none text-gray-700 mb-4 space-y-2 pl-0">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal text-gray-700 mb-4 space-y-2 pl-6 marker:text-blue-500 marker:font-semibold">{children}</ol>,
                      li: ({children}) => {
                        return (
                          <li className="text-gray-700 relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-blue-500 before:font-bold before:text-lg">
                            {children}
                          </li>
                        );
                      },
                      strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                      code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                      pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200">{children}</pre>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2 rounded-r-lg">{children}</blockquote>,
                      hr: () => <hr className="border-gray-300 my-6" />,
                      table: ({children}) => <table className="min-w-full border-collapse border border-gray-300 mb-4">{children}</table>,
                      thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                      th: ({children}) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>,
                      td: ({children}) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 italic">No messages to summarize.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center">
            {/* <div className="flex items-center text-xs text-gray-500">
              {messages.length > 0 && (
                <span className="ml-2">• {messages.length} messages analyzed</span>
              )}
            </div> */}
            <div className="flex space-x-3">
              {!isLoading && summary && (
                <button
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  onClick={generateSummary}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              )}
              {summary && !isLoading && (
                <button
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    copySuccess 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-white bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={copySummary}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
