import React from 'react';
import { Zap } from 'lucide-react';
import { mockIceBreakers } from '../../data/mockData';
import type { IceBreaker } from '../../types';

interface IceBreakersListProps {
  participant: string;
  onStartChatWithMessage: (participant: string, message: string) => void;
}

export const IceBreakersList: React.FC<IceBreakersListProps> = ({
  participant,
  onStartChatWithMessage,
}) => {
  const handleIceBreakerClick = (icebreaker: IceBreaker) => {
    if (!participant.trim()) {
      // If no participant is set, we can show a message or do nothing
      return;
    }
    onStartChatWithMessage(participant, icebreaker.content);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-accent w-5 h-5" />
        <h2 className="text-lg font-semibold text-foreground font-heading">Ice Breakers</h2>
      </div>

      <div className="flex flex-col gap-3">
        {mockIceBreakers.map((icebreaker: IceBreaker) => (
          <div
            key={icebreaker.id}
            className={`bg-card rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-card/80 border border-border ${
              !participant.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleIceBreakerClick(icebreaker)}
          >
            <p className="text-sm text-card-foreground leading-relaxed">{icebreaker.content}</p>
            <span className="text-xs text-muted-foreground block mt-2 font-medium">{icebreaker.context}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
