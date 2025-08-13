import { Link } from 'react-router-dom';
import { KanjiProcessor } from '@/components/KanjiProcessor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, BookOpen, Eye, Settings as SettingsIcon, FileText, EyeOff } from 'lucide-react';
import { OFFICIAL_KANJI_LEVELS } from '@/constants/kanjiLevels';
import { FILTER_MODES } from '@/constants/filterModes';
import { JIS_LEVELS, JIS_LEVEL_LABELS } from '@/constants/jisLevels';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useKanjiData } from '@/hooks/useKanjiData';
import { APP_NAME } from '@/constants/app';
import type { FilterMode, UnassignedJISLevel } from '../types/settings';

/**
 * ホームページコンポーネント
 * フィード表示と漢検マスターモード設定を含む
 */
export function Home() {
  // 漢字データプリロード（アプリ起動時に自動開始）
  useKanjiData();

  // 統合されたユーザー設定管理hook
  const {
    masterModeEnabled,
    masterModeSettings,
    toggleMasterMode,
    updateMasterModeSettings,
    updateShowUnassigned,
    updateUnassignedJisLevel
  } = useUserSettings();

  const feedPosts = [
    {
      id: 1,
      user: '漢字花子',
      username: '@kanji_hanako',
      time: '2時間前',
      type: 'quiz',
      content: '今日の四字熟語クイズ！',
      quiz: {
        question: '「一期一会」の意味は？',
        type: '意味',
        difficulty: 3,
        rating: 4
      },
      likes: 23,
      comments: 5
    },
    {
      id: 2,
      user: '文字太郎',
      username: '@moji_taro',
      time: '4時間前',
      type: 'normal',
      content: '今日漢検準1級の勉強をしていて「瀟洒」という美しい漢字に出会いました。読み方は「しょうしゃ」で、「あっさりしていて上品」という意味です。日本語の表現力の豊かさに改めて感動しています。',
      likes: 47,
      comments: 12
    },
    {
      id: 3,
      user: '古典愛好者',
      username: '@koten_lover',
      time: '6時間前',
      type: 'quiz',
      content: '古典からの出題です',
      quiz: {
        question: '「憂き世」の読み方は？',
        type: '読み',
        difficulty: 4,
        rating: 5
      },
      likes: 31,
      comments: 8
    },
    {
      id: 4,
      user: '地名研究家',
      username: '@chimei_lover',
      time: '8時間前',
      type: 'normal',
      content: '地名で使われる配当外漢字を調べています。「栢森」（かしわもり）は柏の異字体「栢」を使った美しい地名ですね。また「碕」（さき）は「埼」の異字体として岬を表す地名によく使われています。配当外漢字にも深い歴史があります。',
      likes: 18,
      comments: 7
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{APP_NAME}</h1>
        <p className="text-gray-600">{APP_NAME}は漢字学習をする人のコミュニティです。気軽に問題投稿をお楽しみください。</p>
        
        {/* ログイン・サインアップボタン */}
        <div className="mt-6 flex gap-4 justify-center">
          <Button 
            asChild
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Link to="/auth/login">ログインする</Link>
          </Button>
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Link to="/auth/signup">アカウント作成して利用する</Link>
          </Button>
        </div>
      </div>

      {/* 漢検マスターモードコントロール */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {masterModeEnabled ? (
                  <Eye className="w-5 h-5 text-blue-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <Label htmlFor="master-mode" className="font-semibold">
                  漢検マスターモード
                </Label>
              </div>
              <Switch
                id="master-mode"
                checked={masterModeEnabled}
                onCheckedChange={toggleMasterMode}
              />
            </div>

            {masterModeEnabled && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link to="/kanken-master">
                  <SettingsIcon className="w-4 h-4" />
                  設定
                </Link>
              </Button>
            )}
          </div>

          {masterModeEnabled && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-3">
                投稿内の漢字が配当級別に色分け表示されます。漢字にカーソルを合わせると詳細情報が表示されます。
              </p>

              {/* クイック設定 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <Label htmlFor="quick-level" className="text-xs text-blue-700">保持級</Label>
                  <Select
                    value={masterModeSettings.userLevel}
                    onValueChange={(value) => updateMasterModeSettings({ ...masterModeSettings, userLevel: value })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OFFICIAL_KANJI_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="quick-filter" className="text-xs text-blue-700">フィルタ</Label>
                  <Select
                    value={masterModeSettings.filterMode}
                    onValueChange={(value: FilterMode) => updateMasterModeSettings({ ...masterModeSettings, filterMode: value })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FILTER_MODES.ALL}>すべて表示</SelectItem>
                      <SelectItem value={FILTER_MODES.ABOVE}>保持級以上</SelectItem>
                      <SelectItem value={FILTER_MODES.AT_OR_BELOW}>保持級以下</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 配当外漢字設定 */}
              <div className="border-t border-blue-200 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="unassigned-toggle" className="text-xs text-blue-700">配当外漢字表示</Label>
                  <Switch
                    id="unassigned-toggle"
                    checked={masterModeSettings.showUnassigned}
                    onCheckedChange={updateShowUnassigned}
                    className="scale-75"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="jis-level" className={`text-xs ${!masterModeSettings.showUnassigned ? 'text-gray-400' : 'text-blue-600'}`}>JIS水準</Label>
                  <Select
                    value={masterModeSettings.unassignedJisLevel}
                    onValueChange={masterModeSettings.showUnassigned ? (value: UnassignedJISLevel) => updateUnassignedJisLevel(value) : undefined}
                  >
                    <SelectTrigger className={`h-8 text-xs bg-white ${!masterModeSettings.showUnassigned ? 'opacity-50 pointer-events-none' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JIS_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {JIS_LEVEL_LABELS[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {feedPosts.map((post) => (
        <Card key={post.id} className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.user}</span>
                  <span className="text-gray-500 text-sm">{post.username}</span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-400 text-sm">{post.time}</span>
                </div>

                <div className="mt-2">
                  <div className="mb-3">
                    {masterModeEnabled ? (
                      <KanjiProcessor
                        text={post.content}
                        userLevel={masterModeSettings.userLevel}
                        filterMode={masterModeSettings.filterMode}
                        showMode={true}
                        showUnassigned={masterModeSettings.showUnassigned}
                        unassignedJisLevel={masterModeSettings.unassignedJisLevel}
                      />
                    ) : (
                      <p>{post.content}</p>
                    )}
                  </div>

                  {post.type === 'quiz' && post.quiz && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <Badge variant="outline" className="text-xs">
                          {post.quiz.type}クイズ
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          難易度 {post.quiz.difficulty}/5
                        </Badge>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < post.quiz.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="font-medium text-blue-900">
                        {masterModeEnabled ? (
                          <KanjiProcessor
                            text={post.quiz.question}
                            userLevel={masterModeSettings.userLevel}
                            filterMode={masterModeSettings.filterMode}
                            showMode={true}
                            showUnassigned={masterModeSettings.showUnassigned}
                            unassignedJisLevel={masterModeSettings.unassignedJisLevel}
                          />
                        ) : (
                          <p>{post.quiz.question}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm">
                          回答する
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <Link to={`/posts/${post.id}`}>
                            <FileText className="w-3 h-3 mr-1" />
                            詳細
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      ❤️ {post.likes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}