"use client"

import type React from "react"
import { format, isToday, isYesterday } from "date-fns"
import { Search, Plus, Users } from "lucide-react"
import type { Chat } from "../../types"

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

  // Mock unread count for demonstration
  const unreadCount = Math.floor(Math.random() * 5)
  const hasUnread = unreadCount > 0

  return (
    <div
      className={`m-1 border-gray-50 rounded-lg group relative flex items-center px-4 py-4 cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
        isActive ? "bg-blue-500 border-blue-700 rounded-lg text-white" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
            isActive ? "ring-2 ring-accent/30" : ""
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
              isActive ? "text-accent" : "text-foreground"
            }`}
          >
            {chat.name}
          </h3>
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            <span
              className={`text-xs transition-colors duration-200 ${
                isActive ? "text-accent/70" : "text-muted-foreground"
              }`}
            >
              {formatTime(chat.timestamp)}
            </span>
            {hasUnread && (
              <div className="w-5 h-5 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-xs truncate leading-relaxed transition-colors duration-200 ${
            hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
          }`}
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
}

export const ChatList: React.FC<ChatListProps> = ({ chats, activeChat, onChatSelect }) => {
  return (
    <div className="flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 rounded-xl bg-[#f5f5f75d] m-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sidebar-primary-foreground font-heading">Messages</h1>
            <p className="text-sm text-muted-foreground mt-1">{chats.length} conversations</p>
          </div>
          <button className="group p-3 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl transition-all duration-200">
            <Plus className="w-5 h-5" />
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
            className="w-full pl-10 pr-4 py-3 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
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
    </div>
  )
}
