"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { ParticipantInput } from "./ParticipantInput"
import { IceBreakersList } from "./IceBreakersList"

interface NewChatProps {
  onStartChat: (participant: string, message?: string) => void
  onBackToChats?: () => void
}

export const NewChat: React.FC<NewChatProps> = ({ onStartChat, onBackToChats }) => {
  const [participant, setParticipant] = useState("")

  const handleStartChat = (participantName: string) => {
    setParticipant(participantName)
    onStartChat(participantName)
  }

  const handleStartChatWithMessage = (participantName: string, message: string) => {
    setParticipant(participantName)
    onStartChat(participantName, message)
  }

  return (
    <div className="p-4 md:p-6 h-screen bg-background flex flex-col gap-6">
      {/* Header with back button for mobile */}
      <div className="flex items-center gap-4">
        {onBackToChats && (
          <button
            onClick={onBackToChats}
            className="p-2 md:hidden text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-foreground font-heading">Start a New Chat</h2>
      </div>

      <ParticipantInput onStartChat={handleStartChat} />

      <IceBreakersList
        participant={participant}
        onStartChatWithMessage={handleStartChatWithMessage}
      />
    </div>
  )
}
