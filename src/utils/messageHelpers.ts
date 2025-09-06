import type { Message } from '../types';

/**
 * A reusable formatter for consistent timestamp displays.
 * More performant than calling `toLocaleString` repeatedly with options.
 */
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

/**
 * Formats a message timestamp into a human-readable string.
 * e.g., "Sep 07, 1:10 AM"
 * @param timestamp - The ISO string representation of the date.
 * @returns A formatted time string.
 */
export const formatMessageTime = (timestamp: string): string => {
  return timeFormatter.format(new Date(timestamp));
};

/**
 * Extracts and returns the most recent messages from a collection, sorted chronologically.
 * @param messages - The array of all messages.
 * @param limit - The maximum number of recent messages to return. Defaults to 8.
 * @returns A new array containing the most recent messages.
 */
export const getRecentMessages = (messages: Message[], limit: number = 8): Message[] => {
  // Create a shallow copy to avoid mutating the original array, then sort
  return [...messages]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-limit);
};

/**
 * Generates a comprehensive, formatted string summary of a chat conversation.
 * The summary includes metadata and a chronologically grouped message history.
 * @param messages - The array of messages to summarize.
 * @param chatName - The name of the chat.
 * @returns A markdown-formatted string representing the conversation summary.
 */
export const formatMessagesForSummary = (messages: Message[], chatName:string): string => {
  if (messages.length === 0) {
    return `# Conversation Summary\n\n**Chat Name:** ${chatName}\n\nNo messages to display.`;
  }
  
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const participants = Array.from(new Set(sortedMessages.map(m => m.sender)));
  const timeSpan = `${formatMessageTime(sortedMessages[0].timestamp)} - ${formatMessageTime(sortedMessages[sortedMessages.length - 1].timestamp)}`;

  // Group messages by date for better organization
  const messagesByDate = sortedMessages.reduce((acc, msg) => {
    const dateKey = new Date(msg.timestamp).toDateString();
    // Using optional chaining and nullish coalescing for cleaner initialization
    (acc[dateKey] ??= []).push(msg);
    return acc;
  }, {} as Record<string, Message[]>);
  
  // Use an array and .join() for cleaner, more performant string building
  const output: string[] = [
    `# Conversation Summary`,
    `**Chat Name:** ${chatName}`,
    `**Participants:** ${participants.join(', ')} (${participants.length} ${participants.length === 1 ? 'person' : 'people'})`,
    `**Total Messages:** ${sortedMessages.length}`,
    `**Time Period:** ${timeSpan}`,
    `**Conversation Type:** ${participants.length > 2 ? 'Group Chat' : 'Direct Message'}`,
    `\n---\n`,
    `## Message History`
  ];

  for (const [dateKey, dayMessages] of Object.entries(messagesByDate)) {
    const formattedDate = new Date(dateKey).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    output.push(`\n### ${formattedDate}`);
    for (const msg of dayMessages) {
      const timeStamp = formatMessageTime(msg.timestamp);
      const senderLabel = msg.isOwn ? 'You' : msg.sender;
      // Clean and format message content
      const cleanContent = msg.content.trim().replace(/\n+/g, ' ');
      output.push(`- [${timeStamp}] **${senderLabel}:** ${cleanContent}`);
    }
  }

  return output.join('\n');
};


/**
 * Formats the most recent messages to be used as context for generating smart replies.
 * @param messages - The array of all messages in the conversation.
 * @param chatName - The name of the chat.
 * @returns A formatted string containing the context for a smart reply model.
 */
export const formatMessagesForSmartReply = (messages: Message[], chatName: string): string => {
  const recentMessages = getRecentMessages(messages, 6);
  const participants = Array.from(new Set(messages.map(m => m.sender)));

  const contextParts: string[] = [
    `**Conversation Context:**`,
    `- **Chat:** ${chatName}`,
    `- **Type:** ${participants.length > 2 ? 'Group Chat' : 'Direct Message'}`,
    `- **Participants:** ${participants.join(', ')}`,
    ``, // Adds a blank line for spacing
    `**Recent Messages:**`
  ];

  recentMessages.forEach((msg) => {
    const senderLabel = msg.isOwn ? 'You' : msg.sender;
    const timeStamp = formatMessageTime(msg.timestamp);
    contextParts.push(`• [${timeStamp}] **${senderLabel}:** ${msg.content.trim()}`);
  });

  return contextParts.join('\n');
};