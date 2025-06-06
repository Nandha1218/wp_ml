
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatData } from '@/types/chat';
import { Crown, Medal, Award, MessageSquare, Heart, Image, Link } from 'lucide-react';

interface UserRankingProps {
  chatData: ChatData;
}

const UserRanking: React.FC<UserRankingProps> = ({ chatData }) => {
  const rankedUsers = Object.entries(chatData.userStats)
    .map(([user, stats]) => ({
      user,
      ...stats,
      engagementScore: (stats.messageCount * 0.4) + 
                      (stats.emojiCount * 0.3) + 
                      (stats.mediaCount * 0.2) + 
                      (stats.linkCount * 0.1)
    }))
    .sort((a, b) => b.messageCount - a.messageCount);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return <Badge className="bg-yellow-100 text-yellow-800">👑 Chat King/Queen</Badge>;
      case 1: return <Badge className="bg-gray-100 text-gray-800">🥈 Super Active</Badge>;
      case 2: return <Badge className="bg-amber-100 text-amber-800">🥉 Very Active</Badge>;
      default: 
        if (index < 5) return <Badge variant="secondary">Active Member</Badge>;
        return <Badge variant="outline">Member</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {rankedUsers.slice(0, 3).map((user, index) => (
          <Card key={user.user} className={`bg-white/80 backdrop-blur-sm shadow-lg border-0 ${
            index === 0 ? 'ring-2 ring-yellow-400' : 
            index === 1 ? 'ring-2 ring-gray-300' : 
            'ring-2 ring-amber-400'
          }`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-2">
                {getRankIcon(index)}
              </div>
              <CardTitle className="text-lg">{user.user}</CardTitle>
              {getRankBadge(index)}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{user.messageCount}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  <span>{user.emojiCount}</span>
                </div>
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-1 text-green-500" />
                  <span>{user.mediaCount}</span>
                </div>
                <div className="flex items-center">
                  <Link className="h-4 w-4 mr-1 text-purple-500" />
                  <span>{user.linkCount}</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs text-gray-600">Avg Length</div>
                <div className="font-semibold">{Math.round(user.avgMessageLength)} chars</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Ranking Table */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Complete User Ranking</CardTitle>
          <CardDescription>All users ranked by message count and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankedUsers.map((user, index) => (
              <div key={user.user} className={`flex items-center justify-between p-4 rounded-lg ${
                index < 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-50'
              } hover:shadow-md transition-shadow`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{user.user}</div>
                    <div className="text-xs text-gray-600">
                      Engagement Score: {user.engagementScore.toFixed(1)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{user.messageCount}</div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-500">{user.emojiCount}</div>
                    <div className="text-xs text-gray-500">Emojis</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-500">{user.mediaCount}</div>
                    <div className="text-xs text-gray-500">Media</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-500">{Math.round(user.avgMessageLength)}</div>
                    <div className="text-xs text-gray-500">Avg Chars</div>
                  </div>
                  <div>
                    {getRankBadge(index)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRanking;
