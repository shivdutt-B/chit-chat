import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, Navigate, Routes, Route } from 'react-router-dom';
import { ChatList } from '../components/chat/ChatList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { NewChat } from '../components/chat/NewChat';
import { mockChats, mockMessages } from '../data/mockData';
import type { Message } from '../types';

// Component to handle chat window with route params
function ChatWindowWrapper({ 
  messages, 
  onSendMessage, 
  chats,
  onBackToChats
}: { 
  messages: Record<string, Message[]>;
  onSendMessage: (chatId: string, content: string) => void;
  chats: typeof mockChats;
  onBackToChats: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const chatId = id || '';
  const chat = chats.find(c => c.id === chatId);
  
  if (!chat) {
    return <Navigate to="/" replace />;
  }

  return (
    <ChatWindow
      messages={messages[chatId] || []}
      onSendMessage={(content) => onSendMessage(chatId, content)}
      chatName={chat.name}
      chatAvatar={chat.avatar}
      onBackToChats={onBackToChats}
    />
  );
}

function Home() {
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [chats, setChats] = useState(mockChats);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeChat, setActiveChat] = useState<string | undefined>(id);

  // Sync activeChat with route parameter
  useEffect(() => {
    setActiveChat(id);
  }, [id]);

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    console.log("Selected chat ID:", chatId);
    setActiveChat(chatId);
  };

  const handleSendMessage = (chatId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    // Update the last message in the chat list
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: content, timestamp: new Date().toISOString() }
          : chat
      )
    );
  };

  const handleStartNewChat = useCallback((participant: string, initialMessage?: string) => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: participant,
      lastMessage: initialMessage || 'New conversation started',
      timestamp: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(participant)}&background=random`,
      isGroup: false,
    };

    setChats((prev) => [newChat, ...prev]);

    if (initialMessage) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: initialMessage,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };

      setMessages((prev) => ({
        ...prev,
        [newChatId]: [newMessage],
      }));
    }

    navigate(`/chat/${newChatId}`);
  }, [navigate, setChats, setMessages]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Always visible: narrow on small/medium, full width on md+ */}
      <aside className="w-20 md:w-[350px] md:min-w-[350px] flex-shrink-0 border-r border-gray-400">
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onStartNewChat={handleStartNewChat}
        />
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="chat/:id"
            element={
              <ChatWindowWrapper
                messages={messages}
                onSendMessage={handleSendMessage}
                chats={chats}
                onBackToChats={() => navigate('/')}
              />
            }
          />
          <Route
            path="new"
            element={<NewChat onStartChat={handleStartNewChat} onBackToChats={() => navigate('/')} />}
          />
          <Route 
            path="/" 
            element={
              <div className="flex items-center justify-center h-full text-muted-foreground p-4">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-medium mb-2">
                    Welcome to Chat
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="md:hidden">Tap a profile to start chatting</span>
                    <span className="hidden md:inline">Select a chat or start a new one</span>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default Home;