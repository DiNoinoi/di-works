import { useState } from 'react';
import { PostCreation } from './components/PostCreation';
import { UserProfile } from './components/UserProfile';
import { KanjiMasterMode } from './components/KanjiMasterMode';
import { UserDictionary } from './components/UserDictionary';
import { Settings } from './components/Settings';
import { WeakKanjiList } from './components/WeakKanjiList';
import { PostDetail } from './components/PostDetail';
import { KanjiProcessor } from './components/KanjiProcessor';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Home, PlusCircle, User, Search, MessageCircle, Bell, BookOpen, Eye, AlertTriangle, Settings as SettingsIcon, FileText, EyeOff } from 'lucide-react';
import { Header } from './components/layout/Header';

// 新しい統合constants
import { NAVIGATION_IDS } from './constants/navigation';
import { OFFICIAL_KANJI_LEVELS } from './constants/kanjiLevels';
import { FILTER_MODES } from './constants/filterModes';
import { JIS_LEVELS, JIS_LEVEL_LABELS } from './constants/jisLevels';
import { useUserSettings } from './hooks/useUserSettings';
import type { FilterMode, UnassignedJISLevel } from './types/settings';

/**
 * メインアプリケーションコンポーネント
 * 漢字学習とSNS機能を統合したアプリケーション
 */
function App() {
  const [currentView, setCurrentView] = useState<string>(NAVIGATION_IDS.FEED);
  
  // 統合されたユーザー設定管理hook
  const {
    masterModeEnabled,
    masterModeSettings,
    toggleMasterMode,
    updateMasterModeSettings,
    updateShowUnassigned,
    updateUnassignedJisLevel
  } = useUserSettings();

  // ナビゲーション項目の定義
  const navigationItems = [
    { id: NAVIGATION_IDS.FEED, label: 'ホーム', icon: Home },
    { id: NAVIGATION_IDS.SEARCH, label: '検索', icon: Search },
    { id: NAVIGATION_IDS.CREATE, label: '投稿作成', icon: PlusCircle },
    { id: NAVIGATION_IDS.KANJI_MASTER, label: '漢字マスター', icon: Eye },
    { id: NAVIGATION_IDS.DICTIONARY, label: '辞書', icon: BookOpen },
    { id: NAVIGATION_IDS.WEAK_KANJI, label: '苦手漢字', icon: AlertTriangle },
    { id: NAVIGATION_IDS.NOTIFICATIONS, label: '通知', icon: Bell },
    { id: NAVIGATION_IDS.PROFILE, label: 'プロフィール', icon: User },
    { id: NAVIGATION_IDS.SETTINGS, label: '設定', icon: SettingsIcon },
  ];

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

  const renderFeed = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">漢字SNS</h1>
        <p className="text-gray-600">漢字を愛する人たちのコミュニティ</p>
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
                variant="outline"
                size="sm"
                onClick={() => setCurrentView(NAVIGATION_IDS.KANJI_MASTER)}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                設定
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
                
                {masterModeSettings.showUnassigned && (
                  <div className="space-y-1">
                    <Label htmlFor="jis-level" className="text-xs text-blue-600">JIS水準</Label>
                    <Select 
                      value={masterModeSettings.unassignedJisLevel} 
                      onValueChange={(value: UnassignedJISLevel) => updateUnassignedJisLevel(value)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white">
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
                )}
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
                              className={`text-xs ${
                                i < post.quiz.rating ? 'text-yellow-400' : 'text-gray-300'
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
                          size="sm" 
                          variant="outline"
                          onClick={() => setCurrentView(NAVIGATION_IDS.POST_DETAIL)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          詳細
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

  /**
   * 現在のビューに応じてコンテンツをレンダリング
   * @returns レンダリングするJSX要素
   */
  const renderContent = () => {
    switch (currentView) {
      case NAVIGATION_IDS.CREATE:
        return <PostCreation />;
      case NAVIGATION_IDS.PROFILE:
        return <UserProfile />;
      case NAVIGATION_IDS.KANJI_MASTER:
        return <KanjiMasterMode 
          onSettingsChange={updateMasterModeSettings}
          currentSettings={masterModeSettings}
        />;
      case NAVIGATION_IDS.DICTIONARY:
        return <UserDictionary />;
      case NAVIGATION_IDS.WEAK_KANJI:
        return <WeakKanjiList />;
      case NAVIGATION_IDS.SETTINGS:
        return <Settings />;
      case NAVIGATION_IDS.POST_DETAIL:
        return <PostDetail postId={1} />;
      case NAVIGATION_IDS.SEARCH:
        return (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">検索機能</h2>
            <p className="text-gray-600">漢字、ユーザー、クイズを検索できます</p>
          </div>
        );
      case NAVIGATION_IDS.NOTIFICATIONS:
        return (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">通知</h2>
            <p className="text-gray-600">新しい通知はありません</p>
          </div>
        );
      default:
        return renderFeed();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        navigationItems={navigationItems}
      />

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* モバイル用ボトムナビゲーション */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(item.id)}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* モバイル用のボトムスペース */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}

export default App;