import { useState, useCallback } from 'react';
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

function Home() {
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [chats, setChats] = useState(mockChats);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
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

  const testFunction = useCallback((participant: string, message?: string) => {
    console.log('TEST FUNCTION CALLED:', participant, message);
    alert(`Test function called with: ${participant}, ${message || 'no message'}`);
  }, []);

  return (
    <div className="grid grid-cols-[350px_1fr] min-h-screen bg-background">
      <aside className="">
        <ChatList
          chats={chats}
          activeChat={id}
          onChatSelect={handleChatSelect}
          onStartNewChat={testFunction}
        />
      </aside>
      <main className="overflow-hidden">
        <Routes>
          <Route
            path="chat/:id"
            element={
              <ChatWindowWrapper
                messages={messages}
                onSendMessage={handleSendMessage}
                chats={chats}
              />
            }
          />
          <Route
            path="new"
            element={<NewChat onStartChat={handleStartNewChat} />}
          />
          <Route 
            path="/" 
            element={
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a chat or start a new one
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default Home;