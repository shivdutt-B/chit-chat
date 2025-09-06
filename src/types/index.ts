export interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  isGroup: boolean
  participants?: string[]
}

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
  avatar?: string
}

export interface IceBreaker {
  id: string
  content: string
  context: string
}

export interface SmartReply {
  id: string
  content: string
  context: string
}
