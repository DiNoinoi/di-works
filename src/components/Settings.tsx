import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Shield, Award, Eye, EyeOff, Save, Users, Target } from 'lucide-react';

export function Settings() {
  // 用例設定
  const [allowExampleUsage, setAllowExampleUsage] = useState(true);
  const [contributorBadgeVisible, setContributorBadgeVisible] = useState(true);
  
  // デフォルト投稿設定
  const [defaultPostPublic, setDefaultPostPublic] = useState(true);
  const [defaultQuizType, setDefaultQuizType] = useState('reading');
  const [defaultDifficulty, setDefaultDifficulty] = useState(3);
  
  // 非公開投稿管理
  const [privatePostsCount] = useState(23);
  
  // 用例協力の進捗データ
  const contributorStats = {
    totalContributions: 147,
    usedExamples: 89,
    uniqueUsers: 34,
    currentLevel: 'ブロンズ',
    nextLevel: 'シルバー',
    progressToNext: 68,
    requiredForNext: 200
  };

  const badgeLevels = [
    { name: 'ブロンズ', requirement: 50, color: 'bg-orange-100 text-orange-800' },
    { name: 'シルバー', requirement: 200, color: 'bg-gray-100 text-gray-800' },
    { name: 'ゴールド', requirement: 500, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'プラチナ', requirement: 1000, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleSaveSettings = () => {
    console.log('設定を保存:', {
      allowExampleUsage,
      contributorBadgeVisible,
      defaultPostPublic,
      defaultQuizType,
      defaultDifficulty
    });
    alert('設定を保存しました');
  };

  const handleManagePrivatePosts = () => {
    console.log('非公開投稿管理画面を開く');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* 用例協力設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              用例協力設定
            </h3>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="example-usage">投稿を用例として利用する</Label>
                  <p className="text-sm text-gray-600">
                    他のユーザーの辞書で、あなたの投稿が用例として表示されます
                  </p>
                </div>
                <Switch
                  id="example-usage"
                  checked={allowExampleUsage}
                  onCheckedChange={setAllowExampleUsage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="contributor-badge">用例協力バッジを表示</Label>
                  <p className="text-sm text-gray-600">
                    プロフィールに用例協力者のバッジを表示します
                  </p>
                </div>
                <Switch
                  id="contributor-badge"
                  checked={contributorBadgeVisible}
                  onCheckedChange={setContributorBadgeVisible}
                  disabled={!allowExampleUsage}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 用例協力バッジと進捗 */}
          {allowExampleUsage && contributorBadgeVisible && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5" />
                用例協力バッジ
              </h3>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center gap-4">
                  <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                    <Award className="w-4 h-4 mr-1" />
                    {contributorStats.currentLevel}協力者
                  </Badge>
                  <div className="text-sm text-gray-600">
                    {contributorStats.totalContributions}件の投稿が用例として活用されています
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>次のレベル「{contributorStats.nextLevel}」まで</span>
                    <span>{contributorStats.totalContributions}/{contributorStats.requiredForNext}</span>
                  </div>
                  <Progress 
                    value={contributorStats.progressToNext} 
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    あと{contributorStats.requiredForNext - contributorStats.totalContributions}件の貢献で次のレベルに到達
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badgeLevels.map((badge) => (
                    <div 
                      key={badge.name}
                      className={`p-3 rounded-lg border ${
                        contributorStats.totalContributions >= badge.requirement
                          ? badge.color + ' border-current'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-xs">{badge.requirement}件</div>
                        {contributorStats.totalContributions >= badge.requirement && (
                          <div className="text-xs mt-1">✓ 達成済み</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">協力統計</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-blue-600">{contributorStats.usedExamples}</div>
                      <div className="text-gray-600">実際に使用された用例</div>
                    </div>
                    <div>
                      <div className="font-semibold text-green-600">{contributorStats.uniqueUsers}</div>
                      <div className="text-gray-600">利用したユーザー数</div>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-600">85%</div>
                      <div className="text-gray-600">用例採用率</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* デフォルト投稿設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              新規投稿のデフォルト設定
            </h3>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="default-public">投稿を公開する</Label>
                  <p className="text-sm text-gray-600">
                    新規投稿時のデフォルトの公開設定
                  </p>
                </div>
                <Switch
                  id="default-public"
                  checked={defaultPostPublic}
                  onCheckedChange={setDefaultPostPublic}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-quiz-type">デフォルトクイズタイプ</Label>
                  <Select value={defaultQuizType} onValueChange={setDefaultQuizType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">読み</SelectItem>
                      <SelectItem value="meaning">意味</SelectItem>
                      <SelectItem value="antonym">対義語</SelectItem>
                      <SelectItem value="synonym">類義語</SelectItem>
                      <SelectItem value="kanji-writing">漢字書き取り</SelectItem>
                      <SelectItem value="four-character">四字熟語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-difficulty">デフォルト難易度</Label>
                  <Select value={defaultDifficulty.toString()} onValueChange={(value) => setDefaultDifficulty(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (易しい)</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3 (普通)</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5 (難しい)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 非公開投稿管理 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              非公開投稿管理
            </h3>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    <span>非公開投稿数: {privatePostsCount}件</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    非公開投稿は用例として使用されません
                  </p>
                </div>
                <Button variant="outline" onClick={handleManagePrivatePosts}>
                  管理
                </Button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">公開設定について</p>
                    <p className="text-yellow-700 mt-1">
                      非公開投稿はあなた以外のユーザーには表示されず、用例としても使用されません。
                      後から公開設定を変更することも可能です。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 保存ボタン */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="px-8">
              <Save className="w-4 h-4 mr-2" />
              設定を保存
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}