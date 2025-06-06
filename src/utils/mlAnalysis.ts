import { ChatData, MLFeatures } from '@/types/chat';

export const performMLAnalysis = (chatData: ChatData): MLFeatures[] => {
  const users = Object.entries(chatData.userStats);
  
  // Calculate activity scores and create ML features
  const mlFeatures = users.map(([user, stats]) => {
    // Calculate activity score based on weighted features
    const activityScore = (
      (stats.messageCount * 0.4) +
      (stats.emojiCount * 0.3) +
      (stats.mediaCount * 0.2) +
      (stats.linkCount * 0.1)
    );

    // Determine if user is active (top 30% by activity score)
    const allScores = users.map(([, s]) => 
      (s.messageCount * 0.4) + (s.emojiCount * 0.3) + (s.mediaCount * 0.2) + (s.linkCount * 0.1)
    ).sort((a, b) => b - a);
    
    const threshold = allScores[Math.floor(allScores.length * 0.3)] || 0;
    const prediction = activityScore >= threshold ? 'active' : 'inactive';
    
    // Calculate confidence based on how far the score is from threshold
    const maxScore = allScores[0] || 1;
    const normalizedScore = activityScore / maxScore;
    const confidence = Math.min(0.95, Math.max(0.5, normalizedScore + 0.2));

    return {
      user,
      messageCount: stats.messageCount,
      avgMessageLength: stats.avgMessageLength,
      emojiCount: stats.emojiCount,
      mediaCount: stats.mediaCount,
      linkCount: stats.linkCount,
      activityScore,
      prediction: prediction as 'active' | 'inactive',
      confidence
    };
  });

  return mlFeatures.sort((a, b) => b.activityScore - a.activityScore);
};

export const generateInsights = (mlResults: MLFeatures[]): string[] => {
  const activeUsers = mlResults.filter(u => u.prediction === 'active');
  const totalUsers = mlResults.length;
  const averageMessages = mlResults.reduce((sum, u) => sum + u.messageCount, 0) / totalUsers;
  
  const insights = [
    `${activeUsers.length} out of ${totalUsers} users (${Math.round((activeUsers.length / totalUsers) * 100)}%) are predicted to be highly active members.`,
    `The most active user has ${mlResults[0]?.messageCount || 0} messages, which is ${Math.round((mlResults[0]?.messageCount || 0) / averageMessages)}x the average.`,
    `Users with high emoji usage (${mlResults.filter(u => u.emojiCount > 20).length} users) tend to be more engaged in conversations.`,
    `Media sharing is a strong indicator of active participation, with ${mlResults.filter(u => u.mediaCount > 5).length} users being frequent sharers.`
  ];

  if (mlResults.some(u => u.avgMessageLength > 100)) {
    insights.push(`Some users prefer longer, detailed messages (avg >100 characters), indicating thoughtful communication styles.`);
  }

  return insights;
};