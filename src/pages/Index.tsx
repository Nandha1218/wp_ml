
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploader from '@/components/FileUploader';
import ChatAnalytics from '@/components/ChatAnalytics';
import UserRanking from '@/components/UserRanking';
import MLPredictions from '@/components/MLPredictions';
import { ChatData, UserStats } from '@/types/chat';
import { MessageSquare, Users, TrendingUp, Brain } from 'lucide-react';

const Index = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (data: ChatData) => {
    setChatData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            WhatsApp Chat Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your WhatsApp group chat export and discover fascinating insights about communication patterns, 
            user activity, and predict the most active members using machine learning.
          </p>
        </div>

        {/* File Upload Section */}
        {!chatData && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-2 border-dashed border-blue-300 bg-white/70 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-800">Get Started</CardTitle>
                <CardDescription className="text-lg">
                  Upload your WhatsApp chat export file (.txt) to begin analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader 
                  onFileProcessed={handleFileProcessed} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Results */}
        {chatData && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Messages</p>
                      <p className="text-2xl font-bold text-gray-800">{chatData.totalMessages}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-800">{Object.keys(chatData.userStats).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Most Active</p>
                      <p className="text-lg font-bold text-gray-800 truncate">
                        {Object.entries(chatData.userStats)
                          .sort(([,a], [,b]) => b.messageCount - a.messageCount)[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Brain className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ML Analysis</p>
                      <p className="text-lg font-bold text-green-600">Ready</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Analysis Tabs */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100">Analytics</TabsTrigger>
                <TabsTrigger value="ranking" className="data-[state=active]:bg-green-100">User Ranking</TabsTrigger>
                <TabsTrigger value="predictions" className="data-[state=active]:bg-purple-100">ML Predictions</TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-orange-100">Upload New</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="mt-6">
                <ChatAnalytics chatData={chatData} />
              </TabsContent>

              <TabsContent value="ranking" className="mt-6">
                <UserRanking chatData={chatData} />
              </TabsContent>

              <TabsContent value="predictions" className="mt-6">
                <MLPredictions chatData={chatData} />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Upload New Chat File</CardTitle>
                    <CardDescription>
                      Replace current analysis with a new WhatsApp chat export
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader 
                      onFileProcessed={handleFileProcessed} 
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
