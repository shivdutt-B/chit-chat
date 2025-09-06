"use client"

import { useState } from "react"
import { ChatList } from "../components/chat/ChatList"
import { ChatWindow } from "../components/chat/ChatWindow"
import { NewChat } from "../components/chat/NewChat"
import { mockChats, mockMessages } from "../data/mockData"
import type { Message } from "../types/index"

export default function ChatApp() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [showNewChat, setShowNewChat] = useState(false)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId)
    setShowNewChat(false)
  }

  const handleSendMessage = (content: string) => {
    if (!activeChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content,
      timestamp: new Date().toISOString(),
      isOwn: true,
    }

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }))
  }

  const handleStartChat = (participant: string, message?: string) => {
    const newChatId = Date.now().toString()
    const newChat = {
      id: newChatId,
      name: participant,
      lastMessage: message || "Chat started",
      timestamp: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(participant)}&background=6366f1&color=fff`,
      isGroup: false,
    }

    // Add new chat to the list (you'd typically update your chat state here)
    setActiveChat(newChatId)
    setShowNewChat(false)

    if (message) {
      const initialMessage: Message = {
        id: "1",
        sender: "You",
        content: message,
        timestamp: new Date().toISOString(),
        isOwn: true,
      }

      setMessages((prev) => ({
        ...prev,
        [newChatId]: [initialMessage],
      }))
    }
  }

  const activeChatData = mockChats.find((chat) => chat.id === activeChat)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ChatList chats={mockChats} activeChat={activeChat || undefined} onChatSelect={handleChatSelect} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showNewChat ? (
          <NewChat onStartChat={handleStartChat} />
        ) : activeChat && activeChatData ? (
          <ChatWindow
            messages={messages[activeChat] || []}
            onSendMessage={handleSendMessage}
            chatName={activeChatData.name}
            chatAvatar={activeChatData.avatar}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 font-heading">Welcome to Messages</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Select a conversation from the sidebar to start chatting, or create a new conversation.
              </p>
              <button
                onClick={() => setShowNewChat(true)}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-200 font-medium"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
