import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Award, BookOpen, Trophy, Star, Users, Calendar } from 'lucide-react';

const kankenLevels = [
  { level: '1級', color: 'bg-purple-600', passed: 3 },
  { level: '準1級', color: 'bg-indigo-600', passed: 2 },
  { level: '2級', color: 'bg-blue-600', passed: 1 },
  { level: '準2級', color: 'bg-green-600', passed: 1 },
  { level: '3級', color: 'bg-yellow-600', passed: 2 },
];

const certifiedQuizzes = [
  { 
    id: 1, 
    name: '四字熟語マスター', 
    icon: '四', 
    description: '四字熟語に関する10問のクイズで全問正解を達成',
    dateEarned: '2024年3月15日'
  },
  { 
    id: 2, 
    name: '読み名人', 
    icon: '読', 
    description: '難読漢字の読み問題で連続20問正解を達成',
    dateEarned: '2024年2月28日'
  },
  { 
    id: 3, 
    name: '対義語達人', 
    icon: '対', 
    description: '対義語問題で正答率90%以上を維持',
    dateEarned: '2024年1月10日'
  },
  { 
    id: 4, 
    name: '漢検博士', 
    icon: '博', 
    description: '漢検1級レベルの問題を50問以上作成',
    dateEarned: '2024年4月5日'
  },
  { 
    id: 5, 
    name: '熟語創造者', 
    icon: '創', 
    description: 'オリジナル熟語問題を100問以上投稿',
    dateEarned: '2024年3月20日'
  },
  { 
    id: 6, 
    name: '継続学習者', 
    icon: '継', 
    description: '30日連続でクイズに参加',
    dateEarned: '2024年2月14日'
  }
];

export function UserProfile() {
  const userData = {
    name: '漢字太郎',
    username: '@kanji_taro',
    bio: '漢字の美しさに魅了された社会人です。毎日新しい漢字を学ぶことが日課。漢検1級を目指して勉強中！',
    joinDate: '2023年8月',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    stats: {
      postsCount: 234,
      followers: 1250,
      following: 890,
      quizzesSolved: 3420
    }
  };

  const highestLevel = kankenLevels.find(level => level.passed > 0);

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* プロフィール基本情報 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userData.profileImage} alt={userData.name} />
                  <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
                </Avatar>
                
                {/* 最高級バッジ */}
                {highestLevel && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className={`mt-3 ${highestLevel.color} text-white px-3 py-1 text-lg font-bold`}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        {highestLevel.level}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>漢字検定{highestLevel.level}保持者</p>
                      <p>合格回数: {highestLevel.passed}回</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-gray-600">{userData.username}</p>
                  <p className="mt-2 text-gray-700">{userData.bio}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {userData.joinDate}加入
                  </span>
                </div>
                
                <div className="flex gap-6 text-sm">
                  <span><strong>{userData.stats.postsCount}</strong> 投稿</span>
                  <span><strong>{userData.stats.followers.toLocaleString()}</strong> フォロワー</span>
                  <span><strong>{userData.stats.following}</strong> フォロー中</span>
                  <span><strong>{userData.stats.quizzesSolved.toLocaleString()}</strong> クイズ回答</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 漢検級バッジセクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              漢字検定保持級
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {kankenLevels.map((level) => (
                <Tooltip key={level.level}>
                  <TooltipTrigger asChild>
                    <div className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      level.passed > 0 
                        ? `${level.color} text-white border-transparent shadow-md` 
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}>
                      <div className="text-center">
                        <div className="font-bold text-lg">{level.level}</div>
                        {level.passed > 0 && (
                          <div className="text-xs mt-1">×{level.passed}</div>
                        )}
                      </div>
                      {level.passed > 0 && (
                        <Award className="absolute top-1 right-1 w-4 h-4" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>漢字検定{level.level}</p>
                    {level.passed > 0 ? (
                      <p>合格回数: {level.passed}回</p>
                    ) : (
                      <p>未取得</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 認定クイズバッジセクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              認定クイズバッジ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {certifiedQuizzes.map((quiz) => (
                <Tooltip key={quiz.id}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-yellow-50 to-yellow-100 border border-yellow-200 hover:shadow-md transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        {quiz.icon}
                      </div>
                      <div className="text-xs text-center mt-2 font-medium text-gray-700 leading-tight">
                        {quiz.name}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold">{quiz.name}</p>
                    <p className="text-sm mt-1">{quiz.description}</p>
                    <p className="text-xs text-gray-400 mt-2">取得日: {quiz.dateEarned}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              学習統計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userData.stats.quizzesSolved.toLocaleString()}</div>
                <div className="text-sm text-gray-600">回答したクイズ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2,890</div>
                <div className="text-sm text-gray-600">正解数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">84.5%</div>
                <div className="text-sm text-gray-600">正答率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">127</div>
                <div className="text-sm text-gray-600">作成したクイズ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}