
import { ChatData, UserStats } from '@/types/chat';

export const parseChatFile = (fileContent: string): ChatData => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  const userStats: Record<string, UserStats> = {};
  let totalMessages = 0;
  const dates: string[] = [];

  // Regex patterns for different WhatsApp export formats
  const patterns = [
    // Format: 12/31/23, 10:30 PM - Username: Message
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+\d{1,2}:\d{2}\s[APMapm]{2}\s-\s(.*?):\s(.*)/,
    // Format: [12/31/23, 10:30:45 PM] Username: Message
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+\d{1,2}:\d{2}:\d{2}\s[APMapm]{2}\]\s(.*?):\s(.*)/,
    // Format: 31/12/23, 22:30 - Username: Message (24-hour format)
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+\d{1,2}:\d{2}\s-\s(.*?):\s(.*)/,
  ];

  console.log('Starting to parse chat file with', lines.length, 'lines');

  for (const line of lines) {
    let match = null;
    let patternIndex = -1;

    // Try each pattern
    for (let i = 0; i < patterns.length; i++) {
      match = line.match(patterns[i]);
      if (match) {
        patternIndex = i;
        break;
      }
    }

    if (match) {
      const date = match[1];
      const user = match[2].trim();
      const message = match[3];

      // Skip system messages
      if (user.includes('You') && user.includes('added') || 
          user.includes('left') || 
          user.includes('changed') ||
          message.includes('Messages and calls are end-to-end encrypted')) {
        continue;
      }

      dates.push(date);
      totalMessages++;

      if (!userStats[user]) {
        userStats[user] = {
          messageCount: 0,
          totalLength: 0,
          emojiCount: 0,
          mediaCount: 0,
          linkCount: 0,
          avgMessageLength: 0,
        };
      }

      userStats[user].messageCount++;
      userStats[user].totalLength += message.length;

      // Count emojis (basic emoji detection)
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojiMatches = message.match(emojiRegex);
      userStats[user].emojiCount += emojiMatches ? emojiMatches.length : 0;

      // Count media messages
      if (message.includes('<Media omitted>') || 
          message.includes('image omitted') || 
          message.includes('video omitted') ||
          message.includes('audio omitted') ||
          message.includes('document omitted')) {
        userStats[user].mediaCount++;
      }

      // Count links
      if (message.includes('http') || message.includes('www.') || message.includes('.com')) {
        userStats[user].linkCount++;
      }
    }
  }

  // Calculate average message length for each user
  Object.keys(userStats).forEach(user => {
    if (userStats[user].messageCount > 0) {
      userStats[user].avgMessageLength = userStats[user].totalLength / userStats[user].messageCount;
    }
  });

  const sortedDates = dates.sort();
  
  console.log('Parsed data:', {
    totalUsers: Object.keys(userStats).length,
    totalMessages,
    dateRange: {
      start: sortedDates[0] || 'Unknown',
      end: sortedDates[sortedDates.length - 1] || 'Unknown'
    }
  });

  return {
    userStats,
    totalMessages,
    dateRange: {
      start: sortedDates[0] || 'Unknown',
      end: sortedDates[sortedDates.length - 1] || 'Unknown'
    },
    rawMessages: lines
  };
};
