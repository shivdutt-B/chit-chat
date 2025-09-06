import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface ParticipantInputProps {
  onStartChat: (participant: string) => void;
}

export const ParticipantInput: React.FC<ParticipantInputProps> = ({ onStartChat }) => {
  const [participant, setParticipant] = useState("");

  const handleStartChat = () => {
    if (participant.trim()) {
      onStartChat(participant);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-border">
      <input
        className="w-full px-4 py-3 border border-border rounded-lg text-sm text-card-foreground bg-input transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
        placeholder="Enter participant's name or email"
        value={participant}
        onChange={(e) => setParticipant(e.target.value)}
      />
      <button
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          participant.trim()
            ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
        onClick={handleStartChat}
        disabled={!participant.trim()}
      >
        <UserPlus className="w-4 h-4" />
        Start Chat
      </button>
    </div>
  );
};
