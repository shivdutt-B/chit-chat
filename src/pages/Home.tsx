import { useState, useCallback, useEffect } from "react";
import {
  useNavigate,
  useParams,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import { ChatList } from "../components/chat/ChatList";
import { ChatWindow } from "../components/chat/ChatWindow";
import { mockChats, mockMessages } from "../data/mockData";
import type { Message } from "../types";
import { MessageSquare } from "lucide-react";
// Component to handle chat window with route params
function ChatWindowWrapper({
  messages,
  onSendMessage,
  chats,
  onBackToChats,
}: {
  messages: Record<string, Message[]>;
  onSendMessage: (chatId: string, content: string) => void;
  chats: typeof mockChats;
  onBackToChats: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const chatId = id || "";
  const chat = chats.find((c) => c.id === chatId);

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
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
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
      sender: "You",
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
          ? {
              ...chat,
              lastMessage: content,
              timestamp: new Date().toISOString(),
            }
          : chat
      )
    );
  };

  const handleStartNewChat = useCallback(
    (participant: string, initialMessage?: string) => {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        name: participant,
        lastMessage: initialMessage || "New conversation started",
        timestamp: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          participant
        )}&background=random`,
        isGroup: false,
      };

      setChats((prev) => [newChat, ...prev]);

      if (initialMessage) {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: "You",
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
    },
    [navigate, setChats, setMessages]
  );

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
                onBackToChats={() => navigate("/")}
              />
            }
          />

          <Route
            path="/"
            element={
              <div className="flex items-center justify-center h-full bg-gray-50 text-gray-700 p-6 bg-background">
                <div className="text-center max-w-md">
                  {/* Illustration / Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Welcome to Smart Team Chat 🚀
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm md:text-base text-gray-500 mb-6 leading-relaxed">
                    Start a conversation with your teammates and let AI make
                    your chats smarter.
                    <br />
                    Use{" "}
                    <span className="font-medium text-blue-600">
                      Summarize
                    </span>{" "}
                    to quickly catch up, or try{" "}
                    <span className="font-medium text-yellow-600">
                      Smart Reply
                    </span>{" "}
                    for instant suggestions.
                  </p>
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
