import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChatList } from './components/chat/ChatList';
import { ChatWindow } from './components/chat/ChatWindow';
import { NewChat } from './components/chat/NewChat';
import { mockChats, mockMessages } from './data/mockData';
import type { Message } from './types';

// Component to handle chat window with route params
function ChatWindowWrapper({ 
  messages, 
  onSendMessage, 
  chats 
}: { 
  messages: Record<string, Message[]>;
  onSendMessage: (chatId: string, content: string) => void;
  chats: typeof mockChats;
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
    />
  );
}

// Main chat layout component
function ChatLayout({
  messages,
  onSendMessage,
  onStartNewChat
}: {
  messages: Record<string, Message[]>;
  onSendMessage: (chatId: string, content: string) => void;
  onStartNewChat: (participant: string, initialMessage?: string) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="grid grid-cols-[350px_1fr] min-h-screen bg-background">
      <aside className="">
        <ChatList
          chats={mockChats}
          activeChat={id}
          onChatSelect={handleChatSelect}
        />
      </aside>
      <main className="overflow-hidden">
        <Routes>
          <Route
            path="/chat/:id"
            element={
              <ChatWindowWrapper
                messages={messages}
                onSendMessage={onSendMessage}
                chats={mockChats}
              />
            }
          />
          <Route
            path="/new"
            element={<NewChat onStartChat={onStartNewChat} />}
          />
          <Route 
            path="/" 
            element={
              <div className="flex items-center justify-center h-full text-text-secondary">
                Select a chat or start a new one
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

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
  };

  const handleStartNewChat = (participant: string, initialMessage?: string) => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: participant,
      lastMessage: initialMessage || 'New conversation started',
      timestamp: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(participant)}&background=random`,
      isGroup: false,
    };

    mockChats.unshift(newChat);

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
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <ChatLayout
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartNewChat={handleStartNewChat}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
