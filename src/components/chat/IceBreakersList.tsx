import React, { useState, useEffect } from 'react';
import { Zap, Loader2, RefreshCw } from 'lucide-react';
import { generateIcebreakers } from '../../utils/geminiApi';
import type { IceBreaker } from '../../types';

interface IceBreakersListProps {
  participant: string;
  onStartChatWithMessage: (participant: string, message: string) => void;
}

export const IceBreakersList: React.FC<IceBreakersListProps> = ({
  participant,
  onStartChatWithMessage,
}) => {
  const [icebreakers, setIcebreakers] = useState<IceBreaker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (participant.trim()) {
      generateIcebreakerSuggestions();
    } else {
      generateIcebreakerSuggestions(); // Generate default ones
    }
  }, [participant]);

  const generateIcebreakerSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedIcebreakers = await generateIcebreakers(participant);
      setIcebreakers(generatedIcebreakers);
    } catch (err) {
      setError('Failed to generate icebreakers. Please try again.');
      // Set fallback icebreakers
      setIcebreakers([
        { id: 'fallback-1', content: "Hi there! How are you doing?", context: "Friendly greeting" },
        { id: 'fallback-2', content: "Hey! Hope you're having a great day!", context: "Positive greeting" },
        { id: 'fallback-3', content: "Hi! What's new with you?", context: "Casual conversation starter" },
        { id: 'fallback-4', content: "Hello! Nice to connect with you.", context: "Simple introduction" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIceBreakerClick = (icebreaker: IceBreaker) => {
    if (!participant.trim()) {
      return;
    }
    onStartChatWithMessage(participant, icebreaker.content);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-accent w-5 h-5" />
          <h2 className="text-lg font-semibold text-foreground font-heading">Ice Breakers</h2>
          {participant && !isLoading && !error && (
            <span className="text-xs text-muted-foreground ml-2">• AI-generated for {participant}</span>
          )}
        </div>
        {!isLoading && (
          <button
            onClick={generateIcebreakerSuggestions}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-200"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-accent animate-spin mb-2" />
            <span className="text-sm text-muted-foreground">
              {participant ? `Generating icebreakers for ${participant}...` : 'Generating conversation starters...'}
            </span>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm mb-2">{error}</p>
            <button 
              onClick={generateIcebreakerSuggestions}
              className="text-sm text-destructive hover:text-destructive/80 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          icebreakers.map((icebreaker: IceBreaker) => (
            <div
              key={icebreaker.id}
              className={`bg-card rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-card/80 border border-border group ${
                !participant.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleIceBreakerClick(icebreaker)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-2">
                  <p className="text-sm text-card-foreground leading-relaxed group-hover:text-accent transition-colors duration-200">
                    {icebreaker.content}
                  </p>
                  <span className="text-xs text-muted-foreground block mt-2 font-medium">
                    {icebreaker.context}
                  </span>
                </div>
                {icebreaker.type && (
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      icebreaker.type === 'professional' ? 'bg-blue-100 text-blue-700' :
                      icebreaker.type === 'question' ? 'bg-purple-100 text-purple-700' :
                      icebreaker.type === 'greeting' ? 'bg-green-100 text-green-700' :
                      icebreaker.type === 'compliment' ? 'bg-pink-100 text-pink-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {icebreaker.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
