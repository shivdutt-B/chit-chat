"use client"

import type React from "react"
import { useState } from "react"
import { ParticipantInput } from "./ParticipantInput"
import { IceBreakersList } from "./IceBreakersList"

interface NewChatProps {
  onStartChat: (participant: string, message?: string) => void
}

export const NewChat: React.FC<NewChatProps> = ({ onStartChat }) => {
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
    <div className="p-6 h-screen bg-background flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground font-heading">Start a New Chat</h2>

      <ParticipantInput onStartChat={handleStartChat} />

      <IceBreakersList
        participant={participant}
        onStartChatWithMessage={handleStartChatWithMessage}
      />
    </div>
  )
}
