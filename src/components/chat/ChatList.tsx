"use client"

import type React from "react"
import { useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { Search, Plus, Users } from "lucide-react"
import type { Chat } from "../../types"
import { NewChatModal } from "./NewChatModal"

interface ChatListItemProps {
  chat: Chat
  isActive?: boolean
  onClick: () => void
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMM d")
    }
  }

  // Mock unread count for demonstration - use chat.id to make it consistent
  const unreadCount = parseInt(chat.id) % 4 // This will give consistent values (0-3) based on chat ID
  const hasUnread = unreadCount > 0

  return (
    <div
      className={`m-1 rounded-lg group relative flex items-center px-4 py-4 cursor-pointer transition-all duration-200 ${
        isActive 
          ? "bg-blue-500 text-white shadow-lg" 
          : "bg-transparent hover:bg-gray-100 border-gray-50"
      }`}
      onClick={onClick}
      style={isActive ? { backgroundColor: '#3b82f6', color: 'white' } : {}}
    >
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
            isActive ? "ring-2 ring-white/30" : ""
          } shadow-sm`}
        >
          <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} className="w-full h-full object-cover" />
        </div>

        {/* Online status indicator */}
        {/* <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div> */}

        {chat.isGroup && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-green-500">
            <Users className="w-2.5 h-2.5 text-accent-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-medium text-sm truncate transition-colors duration-200 ${
              isActive ? "text-white" : "text-gray-900"
            }`}
            style={isActive ? { color: 'white' } : {}}
          >
            {chat.name}
          </h3>
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            <span
              className={`text-xs transition-colors duration-200 ${
                isActive ? "text-white/90" : "text-gray-500"
              }`}
              style={isActive ? { color: 'rgba(255, 255, 255, 0.9)' } : {}}
            >
              {formatTime(chat.timestamp)}
            </span>
            {hasUnread && (
              <div className={`w-5 h-5 text-xs font-medium rounded-full flex items-center justify-center ${
                isActive 
                  ? "bg-white text-blue-600" 
                  : "bg-blue-500 text-white"
              }`}>
                {unreadCount}
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-xs truncate leading-relaxed transition-colors duration-200 ${
            isActive
              ? "text-white/90 font-medium"
              : hasUnread 
                ? "text-gray-900 font-medium" 
                : "text-gray-600"
          }`}
          style={isActive ? { color: 'rgba(255, 255, 255, 0.9)' } : {}}
        >
          {chat.lastMessage}
        </p>
      </div>
    </div>
  )
}

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

  return (
    <div className="flex flex-col h-screen bg-sidebar">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 rounded-xl bg-[#f5f5f75d] m-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sidebar-primary-foreground font-heading">Messages</h1>
            <p className="text-sm text-muted-foreground mt-1">{chats.length} conversations</p>
          </div>
          <button 
            onClick={() => setIsNewChatModalOpen(true)}
            className="group px-4 cursor-pointer py-2 text-white hover:text-white hover:bg-green-600 rounded-xl transition-all duration-200 w-auto text-sm bg-green-500 font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            New Chat
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-2 bg-[#f5f5f75d] px-1 rounded-xl m-1">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChat}
              onClick={() => onChatSelect(chat.id)}
            />
          ))}
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