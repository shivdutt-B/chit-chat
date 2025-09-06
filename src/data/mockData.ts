import type { Chat, Message, IceBreaker, SmartReply } from "../types"

export const mockChats: Chat[] = [
  {
    id: "1",
    name: "Design Team",
    lastMessage: "The new mockups look great! When can we...",
    timestamp: "2025-09-06T10:30:00Z",
    avatar: "https://ui-avatars.com/api/?name=Design+Team&background=0D8ABC&color=fff",
    isGroup: true,
    participants: ["John Doe", "Sarah Smith", "Mike Johnson"],
  },
  {
    id: "2",
    name: "Sarah Smith",
    lastMessage: "I'll send the updated timeline by EOD",
    timestamp: "2025-09-06T09:15:00Z",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Smith&background=FF6B6B&color=fff",
    isGroup: false,
  },
  {
    id: "3",
    name: "Development Squad",
    lastMessage: "New PR ready for review #123",
    timestamp: "2025-09-05T16:45:00Z",
    avatar: "https://ui-avatars.com/api/?name=Dev+Squad&background=4ECDC4&color=fff",
    isGroup: true,
    participants: ["Alex Chen", "Maria Garcia", "James Wilson"],
  },
  {
    id: "4",
    name: "Mike Johnson",
    lastMessage: "Can we discuss the budget update?",
    timestamp: "2025-09-05T14:20:00Z",
    avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=95A5A6&color=fff",
    isGroup: false,
  },
  {
    id: "5",
    name: "Project Titans",
    lastMessage: "Meeting notes from today's sync...",
    timestamp: "2025-09-05T11:00:00Z",
    avatar: "https://ui-avatars.com/api/?name=Project+Titans&background=9B59B6&color=fff",
    isGroup: true,
    participants: ["Emma Davis", "Tom Brown", "Lisa Anderson"],
  },
]

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "John Doe",
      content: "Hey team! I've uploaded the latest design mockups to Figma.",
      timestamp: "2025-09-06T10:15:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    },
    {
      id: "2",
      sender: "Sarah Smith",
      content: "These look amazing! The new color scheme really pops.",
      timestamp: "2025-09-06T10:20:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Smith&background=FF6B6B&color=fff",
    },
    {
      id: "3",
      sender: "You",
      content: "Great work everyone! When can we start implementation?",
      timestamp: "2025-09-06T10:30:00Z",
      isOwn: true,
    },
  ],
  "2": [
    {
      id: "1",
      sender: "Sarah Smith",
      content: "Hi! I wanted to follow up on yesterday's meeting about the project timeline.",
      timestamp: "2025-09-06T08:00:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Smith&background=FF6B6B&color=fff",
    },
    {
      id: "2",
      sender: "You",
      content: "Thanks for the follow-up! The timeline looks good to me.",
      timestamp: "2025-09-06T08:30:00Z",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Sarah Smith",
      content: "I'll send the updated timeline by EOD",
      timestamp: "2025-09-06T09:15:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Smith&background=FF6B6B&color=fff",
    },
  ],
  "3": [
    {
      id: "1",
      sender: "Alex Chen",
      content: "Team, I've just pushed the new feature branch. Could you review PR #123?",
      timestamp: "2025-09-05T16:00:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Alex+Chen&background=4ECDC4&color=fff",
    },
    {
      id: "2",
      sender: "Maria Garcia",
      content: "Great work! I'll review it now and run the tests.",
      timestamp: "2025-09-05T16:15:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=E74C3C&color=fff",
    },
    {
      id: "3",
      sender: "You",
      content: "I'll take a look at the code coverage and performance metrics.",
      timestamp: "2025-09-05T16:30:00Z",
      isOwn: true,
    },
    {
      id: "4",
      sender: "James Wilson",
      content: "New PR ready for review #123",
      timestamp: "2025-09-05T16:45:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=9B59B6&color=fff",
    },
  ],
  "4": [
    {
      id: "1",
      sender: "Mike Johnson",
      content: "Hi! Hope you're having a good week.",
      timestamp: "2025-09-05T14:00:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=95A5A6&color=fff",
    },
    {
      id: "2",
      sender: "You",
      content: "Thanks Mike! It's been busy but productive. What's up?",
      timestamp: "2025-09-05T14:05:00Z",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Mike Johnson",
      content: "Can we discuss the budget update?",
      timestamp: "2025-09-05T14:20:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=95A5A6&color=fff",
    },
  ],
  "5": [
    {
      id: "1",
      sender: "Emma Davis",
      content: "Team Titans meeting starts in 10 minutes. Don't forget!",
      timestamp: "2025-09-05T10:50:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=9B59B6&color=fff",
    },
    {
      id: "2",
      sender: "Tom Brown",
      content: "Thanks for the reminder! I have my notes ready.",
      timestamp: "2025-09-05T10:55:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Tom+Brown&background=F39C12&color=fff",
    },
    {
      id: "3",
      sender: "Lisa Anderson",
      content: "I'll be joining from home today, sending the dial-in details.",
      timestamp: "2025-09-05T10:58:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=1ABC9C&color=fff",
    },
    {
      id: "4",
      sender: "You",
      content: "Perfect! Looking forward to discussing the project progress.",
      timestamp: "2025-09-05T11:00:00Z",
      isOwn: true,
    },
    {
      id: "5",
      sender: "Emma Davis",
      content: "Meeting notes from today's sync...",
      timestamp: "2025-09-05T11:00:00Z",
      isOwn: false,
      avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=9B59B6&color=fff",
    },
  ],
}

export const mockIceBreakers: IceBreaker[] = [
  {
    id: "1",
    content: "Hi! I wanted to follow up on the project we discussed during the last meeting.",
    context: "Professional Follow-up",
  },
  {
    id: "2",
    content: "Hope you're having a great week! Quick question about the upcoming sprint planning.",
    context: "Team Collaboration",
  },
  {
    id: "3",
    content:
      "I noticed your work on the recent feature release - impressive stuff! Would love to chat about your approach.",
    context: "Peer Recognition",
  },
]

export const mockSmartReplies: SmartReply[] = [
  {
    id: "1",
    content: "Sounds good to me! I'll review it right away.",
    context: "Approval",
  },
  {
    id: "2",
    content: "Let me check on that and get back to you by EOD.",
    context: "Follow-up",
  },
  {
    id: "3",
    content: "Can we schedule a quick call to discuss this in detail?",
    context: "Meeting Request",
  },
]

export const mockThreadSummary = `
This conversation covers:
- Latest design mockup review and feedback
- Color scheme updates and implementation timeline
- Team collaboration and next steps

Key Action Items:
- Development team to review technical requirements
- Schedule implementation kick-off meeting
- Update project timeline with new milestones

Next Steps:
- Sarah to share detailed specifications
- Team to provide resource availability
- Set up follow-up design review session
`
