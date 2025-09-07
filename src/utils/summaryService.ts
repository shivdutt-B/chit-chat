import axios from 'axios';
import type { Message } from '../types';
import { GEMINI_API_ENDPOINT, SUMMARY_SYSTEM_PROMPT } from './constants';
import { formatMessagesForSummary, formatMessageTime } from './messageHelpers';

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

    const generatedSummary = response.data.candidates[0].content.parts[0].text.trim();
    
    // Check for placeholder text in the summary
    // (No longer throwing error, just log a warning)
    const hasPlaceholders = /\[.*?\]/.test(generatedSummary) || 
                          generatedSummary.includes('[') || 
                          generatedSummary.includes(']') ||
                          generatedSummary.includes('insert') ||
                          generatedSummary.includes('mention') ||
                          generatedSummary.includes('specific information') ||
                          generatedSummary.includes('details here') ||
                          generatedSummary.includes('key points');
    if (hasPlaceholders) {
      console.warn('Generated summary contains placeholder text');
    }
    return generatedSummary;
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
