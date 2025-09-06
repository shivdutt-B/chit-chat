# Smart Team Chat UI

A modern AI-powered team chat application built with React and TypeScript. This project demonstrates how AI can enhance team communication through intelligent conversation summaries, smart reply suggestions, and contextual icebreakers.

## 🚀 Features

### Core Functionality
- **Chat List**: Browse and search through conversations with a responsive design
- **Chat Window**: View message threads with real-time messaging interface
- **New Chat**: Start conversations with AI-generated icebreakers
- **Smart Replies**: AI-powered response suggestions based on conversation context
- **Conversation Summaries**: Comprehensive AI-generated summaries of chat threads
- **Responsive Design**: Optimized for both desktop and mobile devices

### AI-Powered Features
- 🤖 **Smart Reply Suggestions** - Get contextually relevant response options
- 📝 **Conversation Summaries** - AI-generated summaries with key points and action items
- 💬 **Icebreaker Generation** - Personalized conversation starters
- 🔄 **Follow-up Messages** - Intelligent follow-up suggestions for ongoing conversations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Markdown**: react-markdown with remark-gfm
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-team-chat-ui
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 📱 Application Structure

### Screens Overview

#### 1. Chat List (`/`)
- **Desktop View**: Full sidebar with search functionality and chat management
- **Mobile View**: Compact avatar-only mode with tooltips
- **Features**:
  - Search conversations by name, participant, or message content
  - Real-time chat filtering
  - Unread message indicators
  - Group chat indicators
  - Responsive layout adaptation

#### 2. Chat Window (`/chat/:id`)
- **Message Display**: Threaded conversations with timestamps
- **Smart Features**:
  - **Summarize Button**: Generates comprehensive conversation summaries
  - **Smart Reply Button**: Context-aware response suggestions
- **Message Input**: Rich text input with emoji support
- **Mobile Navigation**: Back button for easy navigation

#### 3. New Chat (`/new`)
- **Participant Input**: Enter contact name or email
- **AI Icebreakers**: Contextually generated conversation starters
- **Multi-step Modal**: Guided chat creation process
- **Fallback Options**: Default icebreakers when AI fails

### Key Components

```
src/
├── components/
│   └── chat/
│       ├── ChatHeader.tsx          # Chat window header with actions
│       ├── ChatList.tsx            # Main chat list with search
│       ├── ChatWindow.tsx          # Message thread display
│       ├── MessageBubble.tsx       # Individual message component
│       ├── MessageInput.tsx        # Message composition
│       ├── SmartRepliesDropdown.tsx # AI reply suggestions
│       ├── SummaryModal.tsx        # AI summary display
│       ├── IceBreakersList.tsx     # AI icebreaker generation
│       └── NewChatModal.tsx        # Multi-step chat creation
├── utils/
│   ├── geminiApi.ts               # Main API exports
│   ├── summaryService.ts          # Conversation summarization
│   ├── smartReplyService.ts       # Smart reply generation
│   ├── icebreakerService.ts       # Icebreaker generation
│   └── messageHelpers.ts          # Utility functions
└── types/
    └── index.ts                   # TypeScript definitions
```

## 🤖 AI Integration Details

### Conversation Summaries
- **Structured Analysis**: Organized with executive summary, key points, decisions, and action items
- **Context Awareness**: Considers participant roles, conversation type, and timeline
- **Markdown Formatting**: Rich formatting with headers, lists, and emphasis
- **Fallback Handling**: Graceful degradation when API fails

### Smart Replies
- **Context Analysis**: Differentiates between replies and follow-up messages
- **Conversation Understanding**: Analyzes participant dynamics and message history
- **Tone Matching**: Adapts to professional vs. casual conversation styles
- **Placeholder Prevention**: Strict filtering to avoid template responses

### Icebreaker Generation
- **Relationship Context**: Adjusts tone based on professional vs. personal relationships
- **Personalization**: Incorporates participant names and context
- **Variety**: Multiple approaches including questions, greetings, and conversation starters
- **Fallback Options**: Contextual backups for different relationship types


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request