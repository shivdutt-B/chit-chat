import axios from 'axios';
import type { Message } from '../types';
import { GEMINI_API_ENDPOINT, SMART_REPLY_SYSTEM_PROMPT } from './constants';
import { formatMessagesForSmartReply, getRecentMessages } from './messageHelpers';

export interface SmartReply {
  id: number;
  content: string;
  context: string;
  type: string;
}

export async function generateSmartReplies(messages: Message[], chatName: string): Promise<SmartReply[]> {
  try {
    if (messages.length === 0) {
      return [
        { id: 1, content: "Hi there! 👋", context: "Friendly greeting", type: "quick" },
        { id: 2, content: "How are you doing?", context: "Conversation starter", type: "question" },
        { id: 3, content: "What's up?", context: "Casual greeting", type: "quick" }
      ];
    }

    // Analyze conversation context to determine the situation
    const conversationAnalysis = analyzeConversationContext(messages);
    const formattedContext = formatMessagesForSmartReply(messages, chatName);
    
    let prompt: string;
    
    if (conversationAnalysis.isUserOnlySender) {
      // Generate follow-up messages instead of replies
      prompt = `Analyze this conversation where the user has sent message(s) but hasn't received a response yet:

${formattedContext}

**IMPORTANT: The user is the only one who has sent messages so far. Generate follow-up messages or conversation continuations that the user can send, NOT replies to their own message.**

**Context Analysis:**
- Messages sent by user: ${conversationAnalysis.userMessageCount}
- No responses received yet
- Last message sent: ${conversationAnalysis.timeSinceLastMessage}

**CRITICAL INSTRUCTIONS:**
1. Generate COMPLETE, ready-to-send follow-up messages with NO placeholders or brackets
2. Do NOT use template language like [topic], [something about], [previous messages]
3. Write specific, concrete messages that can be sent immediately
4. Create follow-up messages that build on what the user already said

**Examples of what TO create:**
- "Just wanted to add some more context to what I mentioned"
- "Hope this message finds you well!"
- "Let me know what you think when you get a chance"
- "By the way, I also wanted to mention that..."

**Examples of what NOT to create:**
- "I wanted to follow up on [previous topic]"
- "Hope your [situation] is going well"
- "What do you think about [something mentioned]"
- "I was wondering about [topic from earlier]"

Generate 3-5 appropriate follow-up messages that the user can send to continue or enhance the conversation. Do NOT generate replies to the user's own message.`;
    } else {
      // Normal reply generation when there's actual conversation
      prompt = `Analyze this conversation and generate smart reply suggestions:

${formattedContext}

**Context Analysis:**
- Total participants: ${conversationAnalysis.totalParticipants}
- User messages: ${conversationAnalysis.userMessageCount}
- Other messages: ${conversationAnalysis.otherMessageCount}
- Last sender: ${conversationAnalysis.lastSender}

**CRITICAL INSTRUCTIONS:**
1. Generate COMPLETE, ready-to-send reply messages with NO placeholders or brackets
2. Do NOT use template language like [topic], [something about], [their message]
3. Write specific, concrete messages that can be sent immediately
4. Create replies that respond to the other person's message

**Examples of what TO create:**
- "That sounds really interesting!"
- "I completely agree with you"
- "Thanks for letting me know!"
- "That's a great point you made"

**Examples of what NOT to create:**
- "I think [their suggestion] is great"
- "Thanks for sharing [information about topic]"
- "What do you think about [something mentioned]"

Generate 3-5 contextually appropriate reply suggestions based on the conversation above. Consider the tone, relationships, and recent message content.`;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const response = await axios.post(
      `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `${SMART_REPLY_SYSTEM_PROMPT}\n\n${prompt}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const rawResponse = response.data.candidates[0].content.parts[0].text.trim();
    
    try {
      // Clean up the response to extract JSON
      let jsonString = rawResponse;
      
      // Remove any markdown code blocks
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any extra text before or after JSON
      const jsonMatch = jsonString.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      const parsedReplies = JSON.parse(jsonString);
      
      if (Array.isArray(parsedReplies) && parsedReplies.length > 0) {
        // Filter out any replies that contain placeholder text
        const validReplies = parsedReplies
          .filter(reply => {
            const content = reply.content || '';
            // Check for common placeholder patterns
            const hasPlaceholders = /\[.*?\]/.test(content) || 
                                  content.includes('[') || 
                                  content.includes(']') ||
                                  content.includes('insert') ||
                                  content.includes('mention') ||
                                  content.includes('something about') ||
                                  content.includes('previous messages') ||
                                  content.includes('topic from') ||
                                  content.includes('current situation') ||
                                  content.includes('specific thing');
            return !hasPlaceholders;
          })
          .map((reply, index) => ({
            id: index + 1,
            content: reply.content || 'Thanks!',
            context: reply.context || 'AI-generated response',
            type: reply.type || 'quick'
          }));

        // If we filtered out too many, throw an error to use fallback
        if (validReplies.length === 0) {
          throw new Error('All generated replies contained placeholder text');
        }

        return validReplies;
      }
      
      throw new Error('Invalid response format');
      
    } catch (parseError) {
      console.error('Failed to parse smart replies JSON:', parseError);
      throw new Error('Failed to parse AI response');
    }

  } catch (error) {
    console.error('Error generating smart replies:', error);
    return generateFallbackReplies(messages);
  }
}

// Analyze conversation context to determine the situation
function analyzeConversationContext(messages: Message[]) {
  const userMessages = messages.filter(msg => msg.isOwn);
  const otherMessages = messages.filter(msg => !msg.isOwn);
  const lastMessage = messages[messages.length - 1];
  const uniqueSenders = Array.from(new Set(messages.map(msg => msg.sender)));
  
  // Calculate time since last message
  const timeSinceLastMessage = lastMessage 
    ? Math.floor((Date.now() - new Date(lastMessage.timestamp).getTime()) / 1000 / 60) // minutes
    : 0;

  return {
    isUserOnlySender: userMessages.length > 0 && otherMessages.length === 0,
    userMessageCount: userMessages.length,
    otherMessageCount: otherMessages.length,
    totalParticipants: uniqueSenders.length,
    lastSender: lastMessage ? (lastMessage.isOwn ? 'You' : lastMessage.sender) : null,
    timeSinceLastMessage: timeSinceLastMessage > 60 
      ? `${Math.floor(timeSinceLastMessage / 60)} hours ago`
      : `${timeSinceLastMessage} minutes ago`,
    isConversationStarter: messages.length === 1 && userMessages.length === 1,
    needsFollowUp: userMessages.length > 0 && otherMessages.length === 0 && timeSinceLastMessage > 5
  };
}

// Generate contextual fallback replies when API fails
function generateFallbackReplies(messages: Message[]): SmartReply[] {
  const conversationAnalysis = analyzeConversationContext(messages);
  const recentMessages = getRecentMessages(messages, 3);
  const lastMessage = recentMessages[recentMessages.length - 1];
  
  const fallbackReplies: Omit<SmartReply, 'id'>[] = [];
  
  // If user is the only sender, generate follow-up messages
  if (conversationAnalysis.isUserOnlySender) {
    if (conversationAnalysis.isConversationStarter) {
      // First message, suggest follow-ups
      fallbackReplies.push(
        { content: "Hope you're doing well!", context: "Friendly follow-up", type: "followup" },
        { content: "Let me know when you have a chance to chat!", context: "Gentle nudge", type: "followup" },
        { content: "Looking forward to hearing from you 😊", context: "Encouraging response", type: "followup" },
        { content: "No rush, just wanted to reach out!", context: "Casual follow-up", type: "followup" }
      );
    } else {
      // Multiple messages sent, suggest different approaches
      const lastContent = lastMessage?.content.toLowerCase() || '';
      
      if (lastContent.includes('?')) {
        fallbackReplies.push(
          { content: "Just following up on my question above", context: "Question follow-up", type: "followup" },
          { content: "Take your time, no rush!", context: "Patient follow-up", type: "followup" },
          { content: "Let me know your thoughts when you can", context: "Gentle reminder", type: "followup" }
        );
      } else {
        fallbackReplies.push(
          { content: "Also, hope everything is going well with you!", context: "Additional thought", type: "followup" },
          { content: "By the way, let me know if you need anything", context: "Helpful follow-up", type: "followup" },
          { content: "Chat soon! 👋", context: "Friendly closing", type: "followup" },
          { content: "Looking forward to catching up!", context: "Anticipation", type: "followup" }
        );
      }
    }
  } else if (lastMessage) {
    // Normal reply generation for actual conversations
    const lastContent = lastMessage.content.toLowerCase();
    
    if (lastContent.includes('?')) {
      fallbackReplies.push(
        { content: "Let me think about that", context: "Response to question", type: "acknowledgment" },
        { content: "That's a good question!", context: "Acknowledging question", type: "quick" },
        { content: "I'll get back to you on that", context: "Deferring response", type: "detailed" }
      );
    } else if (lastContent.includes('thank') || lastContent.includes('thanks')) {
      fallbackReplies.push(
        { content: "You're welcome! 😊", context: "Response to thanks", type: "quick" },
        { content: "No problem at all", context: "Casual acknowledgment", type: "quick" },
        { content: "Happy to help!", context: "Positive response", type: "quick" }
      );
    } else if (lastContent.includes('sorry') || lastContent.includes('apologize')) {
      fallbackReplies.push(
        { content: "No worries at all", context: "Accepting apology", type: "quick" },
        { content: "It's totally fine", context: "Reassuring response", type: "quick" },
        { content: "Don't worry about it!", context: "Casual acceptance", type: "quick" }
      );
    } else {
      // General fallback replies
      fallbackReplies.push(
        { content: "That sounds great!", context: "Positive acknowledgment", type: "quick" },
        { content: "I understand", context: "Showing comprehension", type: "acknowledgment" },
        { content: "Tell me more about that", context: "Encouraging elaboration", type: "question" },
        { content: "Interesting point", context: "Thoughtful response", type: "acknowledgment" }
      );
    }
  } else {
    // Default fallback if no messages
    fallbackReplies.push(
      { content: "Hi! How are you?", context: "Friendly greeting", type: "question" },
      { content: "Hey there! 👋", context: "Casual greeting", type: "quick" },
      { content: "What's new?", context: "Conversation starter", type: "question" }
    );
  }
  
  return fallbackReplies.slice(0, 4).map((reply, index) => ({
    id: index + 1,
    ...reply
  }));
}
