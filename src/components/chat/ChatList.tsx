"use client"

import type React from "react"
import { useState } from "react"
import type { Chat } from "../../types"
import { NewChatModal } from "./NewChatModal"
import { ChatListHeader } from "./ChatListHeader"
import { SearchBar } from "./SearchBar"
import { ChatListItem } from "./ChatListItem"
import { EmptyState } from "./EmptyState"

interface ChatListProps {
  chats: Chat[]
  activeChat?: string
  onChatSelect: (chatId: string) => void
  onStartNewChat: (participant: string, message?: string) => void
}

export const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onStartNewChat 
}) => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const query = searchQuery.toLowerCase()
    return (
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query) ||
      (chat.participants && chat.participants.some(participant => 
        participant.toLowerCase().includes(query)
      ))
    )
  })

  return (
    <div className="flex flex-col h-screen bg-sidebar">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 rounded-xl bg-[#f5f5f75d] m-1">
        <ChatListHeader
          totalChats={chats.length}
          filteredChats={filteredChats.length}
          searchQuery={searchQuery}
          onNewChatClick={() => setIsNewChatModalOpen(true)}
        />

        {/* Search bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-2 bg-[#f5f5f75d] px-1 rounded-xl m-1">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChat}
                onClick={() => onChatSelect(chat.id)}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={onStartNewChat}
      />
    </div>
  )
}