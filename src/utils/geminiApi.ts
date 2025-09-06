import axios from 'axios';
import type { Message } from '../types';

// const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

const SUMMARY_SYSTEM_PROMPT = `You are an AI assistant specialized in creating comprehensive conversation summaries for workplace communications.

Your task is to analyze conversations and provide structured summaries that help users quickly understand:

**Analysis Requirements:**
1. **Context Understanding**: Identify if this is a team discussion, one-on-one chat, project planning, etc.
2. **Key Topics**: Extract main subjects and themes discussed
3. **Important Information**: Highlight decisions, announcements, updates, or critical information
4. **Action Items**: List any tasks, commitments, deadlines, or next steps mentioned
5. **Participants Overview**: Note key contributors and their roles in the discussion
6. **Timeline**: Mention any dates, deadlines, or time-sensitive information

**Output Format Guidelines:**
Structure your response with clear markdown sections:
- Use **## Section Headers** for main sections
- Use **bold text** for important terms and names
- Use bullet points (•) for lists and key points
- Use numbered lists for action items or sequential information
- Include relevant quotes for important decisions or statements
- Keep each section concise but informative
- Highlight urgency and deadlines prominently

**Required Sections:**
1. **## Executive Summary** - 2-3 sentence overview
2. **## Key Discussion Points** - Main topics and themes
3. **## Important Decisions & Announcements** - Critical information
4. **## Action Items & Next Steps** - Tasks and commitments
5. **## Timeline & Deadlines** - Time-sensitive information (if any)

**Tone Guidelines:**
- Professional and clear language
- Focus on actionable insights
- Maintain objectivity
- Highlight urgency where appropriate
- Use present tense for ongoing items, past tense for completed discussions`;

// Helper function to format message timestamp
const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to format messages for better readability
const formatMessagesForSummary = (messages: Message[], chatName: string): string => {
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

export async function generateConversationSummary(messages: Message[], chatName: string): Promise<string> {
  try {
    // Format messages with better structure and context
    const formattedConversation = formatMessagesForSummary(messages, chatName);

    const prompt = `Please analyze the following conversation and provide a comprehensive summary following the guidelines:

${formattedConversation}

## Analysis Request

Provide a well-structured markdown summary that helps understand the key points, decisions, and action items from this conversation. Focus on practical insights that would be valuable for participants to review later.

**Please follow the required section structure and use clear markdown formatting for optimal readability.**`;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }

    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      {
        contents: [{
          parts: [{
            text: `${SUMMARY_SYSTEM_PROMPT}\n\n${prompt}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        }
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    
    // Enhanced fallback summary with better formatting
    const participants = Array.from(new Set(messages.map(m => m.sender)));
    const timeSpan = messages.length > 0 ? 
      `${formatMessageTime(messages[0].timestamp)} - ${formatMessageTime(messages[messages.length - 1].timestamp)}` 
      : 'Unknown timeframe';
    
    return `## Summary Generation Error

We encountered an issue while generating the AI-powered summary for your conversation with **${chatName}**.

## Conversation Overview

• **Participants:** ${participants.join(', ')}
• **Messages:** ${messages.length} messages exchanged  
• **Time Period:** ${timeSpan}
• **Chat Type:** ${participants.length > 2 ? 'Group Discussion' : 'Direct Conversation'}

## Manual Summary

This conversation contains **${messages.length} messages** between **${participants.length} participant${participants.length > 1 ? 's' : ''}**. The discussion took place over the period from ${timeSpan}.

### Key Statistics:
• Total messages: ${messages.length}
• Active participants: ${participants.length}
• Conversation type: ${participants.length > 2 ? 'Group chat with multiple participants' : 'One-on-one conversation'}

## Next Steps

1. **Review Messages:** Scroll through the conversation above for specific details
2. **Retry Summary:** Try generating the summary again later  
3. **Contact Support:** If this error persists, please contact technical support

---
*Note: This is a fallback summary due to API limitations. The complete conversation history remains available in the chat window.*`;
  }
}
