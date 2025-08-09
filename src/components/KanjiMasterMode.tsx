import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Filter, Eye, EyeOff } from 'lucide-react';

// 漢字データの例
const kanjiData: { [key: string]: { level: string; reading: string; meaning: string; } } = {
  '漢': { level: '3級', reading: 'カン', meaning: '中国・男性' },
  '字': { level: '6級', reading: 'ジ・あざ', meaning: '文字・学問' },
  '検': { level: '4級', reading: 'ケン', meaning: '調べる・取り調べ' },
  '定': { level: '4級', reading: 'テイ・さだ', meaning: '決める・安定' },
  '準': { level: '2級', reading: 'ジュン', meaning: '準じる・基準' },
  '一': { level: '10級', reading: 'イチ・ひと', meaning: '数の1' },
  '級': { level: '3級', reading: 'キュウ', meaning: '等級・階級' },
  '合': { level: '2級', reading: 'ゴウ・あ', meaning: '合わせる・適合' },
  '格': { level: '5級', reading: 'カク', meaning: '格式・資格' },
  '目': { level: '9級', reading: 'モク・め', meaning: '目・視覚器官' },
  '指': { level: '3級', reading: 'シ・ゆび', meaning: '指・指示する' },
  '勉': { level: '3級', reading: 'ベン', meaning: '勉める・努力' },
  '強': { level: '2級', reading: 'キョウ・つよ', meaning: '強い・無理に' },
  '中': { level: '10級', reading: 'チュウ・なか', meaning: '中央・途中' },
  '瀟': { level: '1級', reading: 'ショウ', meaning: 'すっきりした' },
  '洒': { level: '1級', reading: 'シャ', meaning: 'あっさりした' },
  '憂': { level: '準1級', reading: 'ユウ・うれ', meaning: '心配・憂える' },
  '世': { level: '3級', reading: 'セ・よ', meaning: '世の中・時代' },
  '美': { level: '3級', reading: 'ビ・うつく', meaning: '美しい・良い' },
  '感': { level: '3級', reading: 'カン', meaning: '感じる・印象' },
  '動': { level: '3級', reading: 'ドウ・うご', meaning: '動く・変化' }
};

const levelColors: { [key: string]: string } = {
  '10級': 'bg-green-100 text-green-800',
  '9級': 'bg-green-200 text-green-800',
  '8級': 'bg-blue-100 text-blue-800',
  '7級': 'bg-blue-200 text-blue-800',
  '6級': 'bg-cyan-100 text-cyan-800',
  '5級': 'bg-purple-100 text-purple-800',
  '4級': 'bg-indigo-100 text-indigo-800',
  '3級': 'bg-yellow-100 text-yellow-800',
  '2級': 'bg-orange-100 text-orange-800',
  '準2級': 'bg-orange-200 text-orange-800',
  '準1級': 'bg-red-100 text-red-800',
  '1級': 'bg-red-200 text-red-800',
  '配当外': 'bg-gray-100 text-gray-800'
};

interface KanjiCharProps {
  char: string;
  data?: { level: string; reading: string; meaning: string; };
  isHighlighted: boolean;
  compoundMode: boolean;
}

const KanjiChar: React.FC<KanjiCharProps> = ({ char, data, isHighlighted, compoundMode }) => {
  if (!data || !isHighlighted) {
    return <span>{char}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`px-1 rounded ${levelColors[data.level]} cursor-pointer transition-all hover:shadow-sm`}>
          {char}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{char}</span>
            <Badge variant="outline" className="text-xs">
              {data.level}
            </Badge>
          </div>
          <div className="text-sm">
            <div><strong>読み:</strong> {data.reading}</div>
            <div><strong>意味:</strong> {data.meaning}</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface KanjiMasterModeProps {
  onSettingsChange?: (settings: {
    userLevel: string;
    filterMode: 'above' | 'at_or_below' | 'all';
    compoundMode: boolean;
  }) => void;
  currentSettings?: {
    userLevel: string;
    filterMode: 'above' | 'at_or_below' | 'all';
    compoundMode: boolean;
  };
}

export function KanjiMasterMode({ onSettingsChange, currentSettings }: KanjiMasterModeProps) {
  const [userLevel, setUserLevel] = useState(currentSettings?.userLevel || '準1級');
  const [filterMode, setFilterMode] = useState<'above' | 'at_or_below' | 'all'>(currentSettings?.filterMode || 'all');
  const [compoundMode, setCompoundMode] = useState(currentSettings?.compoundMode || false);
  const [showMode, setShowMode] = useState(true);

  // 設定が変更されたときにコールバックを呼ぶ
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        userLevel,
        filterMode,
        compoundMode
      });
    }
  }, [userLevel, filterMode, compoundMode, onSettingsChange]);

  const sampleTexts = [
    '今日漢検準1級の勉強をしていて「瀟洒」という美しい漢字に出会いました。',
    '漢字検定一級合格を目指して勉強中です。',
    '憂き世の感動を表現する漢字の美しさに心を奪われています。'
  ];

  const levelHierarchy = ['10級', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '準2級', '2級', '準1級', '1級'];
  const userLevelIndex = levelHierarchy.indexOf(userLevel);

  const shouldHighlight = (kanjiLevel: string): boolean => {
    if (!showMode) return false;
    if (filterMode === 'all') return true;
    
    const kanjiLevelIndex = levelHierarchy.indexOf(kanjiLevel);
    if (kanjiLevelIndex === -1) return filterMode === 'all'; // 配当外
    
    if (filterMode === 'above') {
      return kanjiLevelIndex <= userLevelIndex;
    } else if (filterMode === 'at_or_below') {
      return kanjiLevelIndex >= userLevelIndex;
    } else {
      return true;
    }
  };

  const processText = (text: string) => {
    return text.split('').map((char, index) => {
      const data = kanjiData[char];
      const isHighlighted = data ? shouldHighlight(data.level) : false;
      
      return (
        <KanjiChar
          key={index}
          char={char}
          data={data}
          isHighlighted={isHighlighted}
          compoundMode={compoundMode}
        />
      );
    });
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* 漢字マスターモード説明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              漢字マスターモード
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              投稿テキスト内の漢字を配当級別に色分けして表示します。漢字にカーソルを合わせると詳細情報が表示されます。
            </p>
            
            {/* フィルタ設定 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="user-level">保持級</Label>
                <Select value={userLevel} onValueChange={setUserLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="保持級を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelHierarchy.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-mode">フィルタ</Label>
                <Select value={filterMode} onValueChange={setFilterMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">保持級以上を表示</SelectItem>
                    <SelectItem value="at_or_below">保持級以下を表示</SelectItem>
                    <SelectItem value="all">すべて表示</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compound-mode">熟語モード</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="compound-mode"
                    checked={compoundMode}
                    onCheckedChange={setCompoundMode}
                  />
                  <Label htmlFor="compound-mode" className="text-sm">
                    {compoundMode ? 'ON' : 'OFF'}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="show-mode">表示モード</Label>
                <Button
                  variant={showMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMode(!showMode)}
                  className="w-full"
                >
                  {showMode ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      表示中
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      非表示
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 配当級凡例 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">配当級凡例</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(levelColors).map(([level, colorClass]) => (
                  <Badge key={level} className={colorClass}>
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* サンプルテキスト */}
        <Card>
          <CardHeader>
            <CardTitle>投稿サンプル</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sampleTexts.map((text, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <span>ユーザー{index + 1}</span>
                  <span>·</span>
                  <span>3時間前</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-lg leading-relaxed">
                    {processText(text)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <Card>
          <CardHeader>
            <CardTitle>学習統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-600">既知漢字数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">328</div>
                <div className="text-sm text-gray-600">学習中漢字</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <div className="text-sm text-gray-600">苦手漢字</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">92.3%</div>
                <div className="text-sm text-gray-600">習得率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}