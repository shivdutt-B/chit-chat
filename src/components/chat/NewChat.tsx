"use client"

import type React from "react"
import { useState } from "react"
import { UserPlus, Zap } from "lucide-react"
import { mockIceBreakers } from "../../data/mockData"
import type { IceBreaker } from "../../types"

interface NewChatProps {
  onStartChat: (participant: string, message?: string) => void
}

export const NewChat: React.FC<NewChatProps> = ({ onStartChat }) => {
  const [participant, setParticipant] = useState("")

  return (
    <div className="p-6 h-screen bg-background flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground font-heading">Start a New Chat</h2>

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
          onClick={() => participant.trim() && onStartChat(participant)}
          disabled={!participant.trim()}
        >
          <UserPlus className="w-4 h-4" />
          Start Chat
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-accent w-5 h-5" />
          <h2 className="text-lg font-semibold text-foreground font-heading">Ice Breakers</h2>
        </div>

        <div className="flex flex-col gap-3">
          {mockIceBreakers.map((icebreaker: IceBreaker) => (
            <div
              key={icebreaker.id}
              className="bg-card rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-card/80 border border-border"
              onClick={() => participant.trim() && onStartChat(participant, icebreaker.content)}
            >
              <p className="text-sm text-card-foreground leading-relaxed">{icebreaker.content}</p>
              <span className="text-xs text-muted-foreground block mt-2 font-medium">{icebreaker.context}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
