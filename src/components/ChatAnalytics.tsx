
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChatData } from '@/types/chat';

interface ChatAnalyticsProps {
  chatData: ChatData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const ChatAnalytics: React.FC<ChatAnalyticsProps> = ({ chatData }) => {
  const userStatsArray = Object.entries(chatData.userStats)
    .map(([user, stats]) => ({
      user: user.length > 15 ? user.substring(0, 15) + '...' : user,
      fullUser: user,
      ...stats,
    }))
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10); // Top 10 users

  const messageData = userStatsArray.map((user, index) => ({
    ...user,
    fill: COLORS[index % COLORS.length]
  }));

  const pieData = userStatsArray.slice(0, 6).map((user, index) => ({
    name: user.user,
    value: user.messageCount,
    fill: COLORS[index % COLORS.length]
  }));

  const totalEmojis = Object.values(chatData.userStats).reduce((sum, stats) => sum + stats.emojiCount, 0);
  const totalMedia = Object.values(chatData.userStats).reduce((sum, stats) => sum + stats.mediaCount, 0);
  const totalLinks = Object.values(chatData.userStats).reduce((sum, stats) => sum + stats.linkCount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Message Count Bar Chart */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Messages per User</CardTitle>
          <CardDescription>Top 10 most active users by message count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="user" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [value, 'Messages']}
                labelFormatter={(label) => {
                  const user = messageData.find(u => u.user === label);
                  return user ? user.fullUser : label;
                }}
              />
              <Bar dataKey="messageCount" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Message Distribution Pie Chart */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Message Distribution</CardTitle>
          <CardDescription>Percentage of total messages by top users</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Message Length */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Average Message Length</CardTitle>
          <CardDescription>Characters per message by user</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="user" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [Math.round(value as number), 'Avg Characters']}
              />
              <Bar dataKey="avgMessageLength" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Activity Summary</CardTitle>
          <CardDescription>Overall chat statistics and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalEmojis}</div>
              <div className="text-sm text-gray-600">Total Emojis</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalMedia}</div>
              <div className="text-sm text-gray-600">Media Shared</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalLinks}</div>
              <div className="text-sm text-gray-600">Links Shared</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(chatData.totalMessages / Object.keys(chatData.userStats).length)}
              </div>
              <div className="text-sm text-gray-600">Avg per User</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <p><strong>Date Range:</strong> {chatData.dateRange.start} to {chatData.dateRange.end}</p>
              <p><strong>Most Active User:</strong> {Object.entries(chatData.userStats)
                .sort(([,a], [,b]) => b.messageCount - a.messageCount)[0]?.[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatAnalytics;
