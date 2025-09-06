"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
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
    <div className="flex flex-col h-screen">
      {/* Header - Hidden on small screens for compact mode */}
      <div className="hidden md:block flex-shrink-0 px-4 md:px-6 py-4 md:py-6 rounded-xl bg-[#f5f5f75d] m-1">
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

      {/* Compact header for small screens - just new chat button */}
      <div className="md:hidden flex-shrink-0 p-2 flex justify-center">
        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200"
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-1 md:py-2 bg-[#f5f5f75d] px-0 md:px-1 rounded-xl m-0 md:m-1">
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
            <div className="hidden md:block">
              <EmptyState searchQuery={searchQuery} />
            </div>
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