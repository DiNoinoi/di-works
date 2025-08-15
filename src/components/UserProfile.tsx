import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, BookOpen, Trophy, Star, Calendar } from 'lucide-react';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { profileService } from '@/services/api/profile';
import { UserProfileBasicResponse } from '@/types/api/profile/response/UserProfileBasicResponse';

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
  const { userId } = useLoginUserStore();
  const [profileData, setProfileData] = useState<UserProfileBasicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError('ユーザーIDが見つかりません');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await profileService.getProfileBasic(userId);
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('プロフィール情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">読み込み中...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error || 'プロフィール情報を取得できませんでした'}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 日付フォーマット
  const joinDate = new Date(profileData.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  });

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
                  <AvatarImage src="" alt={profileData.user_name} />
                  <AvatarFallback className="text-2xl">{profileData.user_name[0]}</AvatarFallback>
                </Avatar>

                {/* 最高級バッジ */}
                {highestLevel && (
                  <div className="mt-3">
                    <Badge
                      className={`${highestLevel.color} text-white px-3 py-1 text-lg font-bold`}
                      title={`漢字検定${highestLevel.level}保持者 - 合格回数: ${highestLevel.passed}回`}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      {highestLevel.level}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.user_name}</h1>
                  <p className="text-gray-600">@{profileData.display_id}</p>
                  {profileData.profile_text && (
                    <p className="mt-2 text-gray-700">{profileData.profile_text}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {joinDate}加入
                  </span>
                </div>

                <div className="flex gap-6 text-sm">
                  <span><strong>{profileData.post_count}</strong> 投稿</span>
                  <span><strong>{profileData.follower_count.toLocaleString()}</strong> フォロワー</span>
                  <span><strong>{profileData.following_count}</strong> フォロー中</span>
                  <span><strong>{profileData.answer_count.toLocaleString()}</strong> 解答数</span>
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
                    <div className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${level.passed > 0
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
                <div className="text-2xl font-bold text-blue-600">{profileData.answer_count.toLocaleString()}</div>
                <div className="text-sm text-gray-600">解答数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{profileData.correct_count.toLocaleString()}</div>
                <div className="text-sm text-gray-600">正解数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profileData.answer_count > 0 
                    ? `${((profileData.correct_count / profileData.answer_count) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </div>
                <div className="text-sm text-gray-600">正答率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{profileData.post_count}</div>
                <div className="text-sm text-gray-600">投稿数</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}