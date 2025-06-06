
export interface UserStats {
  messageCount: number;
  totalLength: number;
  emojiCount: number;
  mediaCount: number;
  linkCount: number;
  avgMessageLength: number;
  isActive?: boolean;
  activityScore?: number;
}

export interface ChatData {
  userStats: Record<string, UserStats>;
  totalMessages: number;
  dateRange: {
    start: string;
    end: string;
  };
  rawMessages: string[];
}

export interface MLFeatures {
  user: string;
  messageCount: number;
  avgMessageLength: number;
  emojiCount: number;
  mediaCount: number;
  linkCount: number;
  activityScore: number;
  prediction: 'active' | 'inactive';
  confidence: number;
}
