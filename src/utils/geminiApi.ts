// Main geminiApi.ts file - now clean and focused
// Re-export everything for backward compatibility
export { generateConversationSummary } from './summaryService';
export { generateSmartReplies, type SmartReply } from './smartReplyService';
export { generateIcebreakers } from './icebreakerService';
export { 
  formatMessageTime, 
  getRecentMessages, 
  formatMessagesForSummary, 
  formatMessagesForSmartReply 
} from './messageHelpers';
export { 
  GEMINI_API_ENDPOINT, 
  SUMMARY_SYSTEM_PROMPT, 
  SMART_REPLY_SYSTEM_PROMPT,
  ICEBREAKER_SYSTEM_PROMPT 
} from './constants';
