export type AppScreen = 'main' | 'speaking' | 'topics' | 'mystory' | 'badges' | 'parent' | 'minigame';

export interface ChatMessage {
  id: string;
  sender: 'ready' | 'child';
  text: string;
  timestamp: Date;
  topic?: string;
}

export interface TopicOption {
  id: string;
  emoji: string;
  title: string;
  promptText: string;
  color: string;
  bgColor: string;
}

export interface StoryRecord {
  id: string;
  topicTag: string;
  topicTagBg: string;
  topicTagColor: string;
  title: string;
  dateText: string;
  emoji: string;
  thumbnailBg: string;
  messages?: { sender: string; text: string }[];
  createdAt: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  desc: string;
  condition: string;
  earned: boolean;
  earnedDate?: string;
  image?: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  category: 'story' | 'speaking' | 'attendance' | 'special';
  progress?: { current: number; total: number };
}

