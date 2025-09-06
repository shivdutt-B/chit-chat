import type { Message } from '../types';

// Helper function to format message timestamp
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to get recent context messages
export const getRecentMessages = (messages: Message[], limit: number = 8): Message[] => {
  return messages
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-limit);
};

// Helper function to format messages for summary
export const formatMessagesForSummary = (messages: Message[], chatName: string): string => {
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const participants = Array.from(new Set(messages.map(m => m.sender)));
  const timeSpan = messages.length > 0 ? 
    `${formatMessageTime(sortedMessages[0].timestamp)} - ${formatMessageTime(sortedMessages[sortedMessages.length - 1].timestamp)}` 
    : 'Unknown timeframe';

  // Group messages by date for better organization
  const messagesByDate = sortedMessages.reduce((acc, msg) => {
    const dateKey = new Date(msg.timestamp).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  let formattedConversation = `**Conversation Details:**
- **Chat Name:** ${chatName}
- **Participants:** ${participants.join(', ')} (${participants.length} ${participants.length === 1 ? 'person' : 'people'})
- **Total Messages:** ${messages.length}
- **Time Period:** ${timeSpan}
- **Conversation Type:** ${participants.length > 2 ? 'Group Chat' : 'Direct Message'}

**Message History:**
`;

  // Format messages grouped by date for better readability
  Object.entries(messagesByDate).forEach(([dateKey, dayMessages]) => {
    const formattedDate = new Date(dateKey).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    formattedConversation += `\n**${formattedDate}**\n`;
    
    dayMessages.forEach((msg) => {
      const timeStamp = formatMessageTime(msg.timestamp);
      const senderLabel = msg.isOwn ? 'You' : msg.sender;
      
      // Clean and format message content
      const cleanContent = msg.content.trim().replace(/\n/g, ' ');
      
      formattedConversation += `• [${timeStamp}] **${senderLabel}:** ${cleanContent}\n`;
    });
  });

  return formattedConversation;
};

// Helper function to format messages for smart reply context
export const formatMessagesForSmartReply = (messages: Message[], chatName: string): string => {
  const recentMessages = getRecentMessages(messages, 6);
  
  const participants = Array.from(new Set(messages.map(m => m.sender)));
  const conversationType = participants.length > 2 ? 'Group Chat' : 'Direct Message';
  
  let context = `**Conversation Context:**
- **Chat:** ${chatName}
- **Type:** ${conversationType}
- **Participants:** ${participants.join(', ')}

**Recent Messages:**
`;

  recentMessages.forEach((msg) => {
    const senderLabel = msg.isOwn ? 'You' : msg.sender;
    const timeStamp = formatMessageTime(msg.timestamp);
    context += `• [${timeStamp}] **${senderLabel}:** ${msg.content.trim()}\n`;
  });

  return context;
};
