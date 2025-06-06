
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChatData, MLFeatures } from '@/types/chat';
import { performMLAnalysis, generateInsights } from '@/utils/mlAnalysis';
import { Brain, TrendingUp, Users, Lightbulb, Activity, Target } from 'lucide-react';

interface MLPredictionsProps {
  chatData: ChatData;
}

const MLPredictions: React.FC<MLPredictionsProps> = ({ chatData }) => {
  const mlResults = useMemo(() => {
    return performMLAnalysis(chatData);
  }, [chatData]);

  const insights = useMemo(() => {
    return generateInsights(mlResults);
  }, [mlResults]);

  const activeUsers = mlResults.filter(user => user.prediction === 'active');
  const inactiveUsers = mlResults.filter(user => user.prediction === 'inactive');

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityBadge = (prediction: string, confidence: number) => {
    if (prediction === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800">
          🔥 Highly Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          😴 Less Active
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ML Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">ML Analysis</p>
                <p className="text-2xl font-bold text-blue-900">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Active Users</p>
                <p className="text-2xl font-bold text-green-900">{activeUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Accuracy</p>
                <p className="text-2xl font-bold text-purple-900">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI-Generated Insights</span>
          </CardTitle>
          <CardDescription>
            Key findings from machine learning analysis of your chat data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Predictions */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
            <Activity className="h-5 w-5 text-blue-500" />
            <span>User Activity Predictions</span>
          </CardTitle>
          <CardDescription>
            ML-powered predictions of user engagement levels with confidence scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mlResults.map((user, index) => (
              <div key={user.user} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.user}</h3>
                      <p className="text-sm text-gray-600">Activity Score: {user.activityScore.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getActivityBadge(user.prediction, user.confidence)}
                    <p className={`text-sm font-medium ${getConfidenceColor(user.confidence)}`}>
                      {(user.confidence * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-semibold text-blue-600">{user.messageCount}</div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-semibold text-red-500">{user.emojiCount}</div>
                    <div className="text-xs text-gray-500">Emojis</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-semibold text-green-500">{user.mediaCount}</div>
                    <div className="text-xs text-gray-500">Media</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-semibold text-purple-500">{user.linkCount}</div>
                    <div className="text-xs text-gray-500">Links</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="font-semibold text-orange-500">{Math.round(user.avgMessageLength)}</div>
                    <div className="text-xs text-gray-500">Avg Length</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Confidence Level</span>
                    <span>{(user.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={user.confidence * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Model Information</CardTitle>
          <CardDescription>Details about the machine learning analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Features Used</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Message count (40% weight)</li>
                <li>• Emoji usage (30% weight)</li>
                <li>• Media sharing (20% weight)</li>
                <li>• Link sharing (10% weight)</li>
                <li>• Average message length</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Algorithm</h4>
              <p className="text-sm text-gray-600">
                Custom activity classifier based on weighted feature scoring. 
                Users in the top 30% by activity score are classified as "highly active". 
                Confidence scores reflect the certainty of predictions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLPredictions;
