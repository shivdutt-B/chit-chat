import axios from 'axios';
import type { IceBreaker } from '../types';
import { GEMINI_API_ENDPOINT, ICEBREAKER_SYSTEM_PROMPT } from './constants';

export async function generateIcebreakers(participantName: string, context?: string): Promise<IceBreaker[]> {
  try {
    if (!participantName.trim()) {
      return getDefaultIcebreakers();
    }

    // Create context for the icebreaker generation
    const relationshipContext = determineRelationshipContext(participantName);
    
    const prompt = `Generate conversation starter suggestions for a new chat with "${participantName}".

**Context Information:**
- **Contact Name:** ${participantName}
- **Relationship Type:** ${relationshipContext}
- **Additional Context:** ${context || 'New conversation'}
- **Goal:** Start a meaningful conversation that encourages engagement

**CRITICAL REQUIREMENTS:**
1. Create COMPLETE, ready-to-send messages with NO placeholders or brackets
2. Do NOT use template language like [insert name], [mention something], [their work], etc.
3. Every message must be immediately usable without any editing
4. Write natural, conversational icebreakers that sound human
5. Avoid generic greetings - make them engaging and specific

**Examples of what TO DO:**
- "Hey ${participantName}! Hope you're having an awesome day!"
- "Hi ${participantName}! I was just thinking we should catch up soon."
- "Good morning ${participantName}! How's everything going with you?"

**Examples of what NOT to do:**
- "Hey ${participantName}! [Something personal about them]"
- "Hi ${participantName}! Hope your [current situation] is going well!"
- "Hello! I wanted to mention [something specific]"

Generate 4-6 contextually appropriate icebreaker messages for ${participantName}. Make each message complete, natural, and immediately sendable. Consider the relationship type: ${relationshipContext}.`;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const response = await axios.post(
      `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `${ICEBREAKER_SYSTEM_PROMPT}\n\n${prompt}`
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
      
      const parsedIcebreakers = JSON.parse(jsonString);
      
      if (Array.isArray(parsedIcebreakers) && parsedIcebreakers.length > 0) {
        // Filter out any icebreakers that contain placeholder text
        const validIcebreakers = parsedIcebreakers
          .filter(icebreaker => {
            const content = icebreaker.content || '';
            // Check for common placeholder patterns
            const hasPlaceholders = /\[.*?\]/.test(content) || 
                                  content.includes('[') || 
                                  content.includes(']') ||
                                  content.includes('insert') ||
                                  content.includes('mention') ||
                                  content.includes('something about') ||
                                  content.includes('their work') ||
                                  content.includes('specific thing');
            return !hasPlaceholders;
          })
          .map((icebreaker, index) => ({
            id: `ai-icebreaker-${index + 1}`,
            content: icebreaker.content || 'Hi there!',
            context: icebreaker.context || 'AI-generated conversation starter',
            type: icebreaker.type || 'greeting'
          }));

        // If we filtered out too many, throw an error to use fallback
        if (validIcebreakers.length === 0) {
          throw new Error('All generated icebreakers contained placeholder text');
        }

        return validIcebreakers;
      }
      
      throw new Error('Invalid response format');
      
    } catch (parseError) {
      console.error('Failed to parse icebreakers JSON:', parseError);
      throw new Error('Failed to parse AI response');
    }

  } catch (error) {
    console.error('Error generating icebreakers:', error);
    return getFallbackIcebreakers(participantName);
  }
}

// Determine relationship context based on name patterns or other clues
function determineRelationshipContext(participantName: string): string {
  const name = participantName.toLowerCase();
  
  // Simple heuristics for relationship type
  if (name.includes('@') || name.includes('.com')) {
    return 'Professional/Email contact';
  } else if (name.includes('dr.') || name.includes('prof.')) {
    return 'Professional/Academic';
  } else if (name.includes('team') || name.includes('group')) {
    return 'Team/Group chat';
  } else if (/^[a-z]+\s[a-z]+$/i.test(name)) {
    return 'Personal/Full name';
  } else {
    return 'Personal/Casual';
  }
}

// Default icebreakers for when no participant is specified
function getDefaultIcebreakers(): IceBreaker[] {
  return [
    { id: 'default-1', content: "Hey! How's your day going?", context: "Casual daily check-in", type: 'greeting' },
    { id: 'default-2', content: "Hi there! What have you been up to lately?", context: "General catch-up", type: 'question' },
    { id: 'default-3', content: "Hope you're having a great day!", context: "Positive greeting", type: 'greeting' },
    { id: 'default-4', content: "What's new and exciting in your world?", context: "Engaging conversation starter", type: 'question' },
    { id: 'default-5', content: "Hi! I was just thinking about you.", context: "Personal connection", type: 'compliment' }
  ];
}

// Contextual fallback icebreakers based on participant name
function getFallbackIcebreakers(participantName: string): IceBreaker[] {
  const relationshipType = determineRelationshipContext(participantName);
  
  if (relationshipType.includes('Professional')) {
    return [
      { id: 'prof-1', content: `Hi ${participantName}, hope you're having a productive day!`, context: "Professional greeting", type: 'professional' },
      { id: 'prof-2', content: `Good morning ${participantName}! Hope your week is going well.`, context: "Professional check-in", type: 'professional' },
      { id: 'prof-3', content: `Hello ${participantName}! I wanted to reach out and connect.`, context: "Professional introduction", type: 'professional' },
      { id: 'prof-4', content: `Hi ${participantName}! Hope everything is going smoothly on your end.`, context: "Formal but friendly", type: 'professional' },
      { id: 'prof-5', content: `Good afternoon ${participantName}! How are things progressing?`, context: "Professional follow-up", type: 'professional' }
    ];
  } else {
    return [
      { id: 'casual-1', content: `Hey ${participantName}! How's your day treating you?`, context: "Friendly greeting", type: 'greeting' },
      { id: 'casual-2', content: `Hi ${participantName}! Hope you're doing awesome today!`, context: "Positive greeting", type: 'greeting' },
      { id: 'casual-3', content: `${participantName}! Long time no chat! How have you been?`, context: "Reconnecting message", type: 'casual' },
      { id: 'casual-4', content: `Hey ${participantName}! What's been keeping you busy lately?`, context: "Engaging question", type: 'question' },
      { id: 'casual-5', content: `Hi ${participantName}! Hope you're having a fantastic week so far!`, context: "Enthusiastic greeting", type: 'greeting' },
      { id: 'casual-6', content: `${participantName}! I was just thinking we should catch up soon.`, context: "Personal connection", type: 'casual' }
    ];
  }
}
