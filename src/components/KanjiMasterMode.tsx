import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Eye } from 'lucide-react';

// 新しい統合constants
import { OFFICIAL_KANJI_LEVELS } from '../constants/kanjiLevels';
import { FILTER_MODES } from '../constants/filterModes';
import { JIS_LEVELS, JIS_LEVEL_LABELS, JIS_LEVEL_4 } from '../constants/jisLevels';
import { LEVEL_PRE1 } from '../constants/kanjiLevels';
import { getLevelColor, LEVEL_COLORS } from '../constants/colors';
import type { MasterModeSettings, FilterMode, UnassignedJISLevel } from '../types/settings';

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


interface KanjiCharProps {
  char: string;
  data?: { level: string; reading: string; meaning: string; };
  isHighlighted: boolean;
}

const KanjiChar: React.FC<KanjiCharProps> = ({ char, data, isHighlighted }) => {
  if (!data || !isHighlighted) {
    return <span>{char}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`px-1 rounded ${getLevelColor(data.level)} cursor-pointer transition-all hover:shadow-sm`}>
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
  onSettingsChange?: (settings: MasterModeSettings) => void;
  currentSettings?: MasterModeSettings;
}

export function KanjiMasterMode({ onSettingsChange, currentSettings }: KanjiMasterModeProps) {
  const [userLevel, setUserLevel] = useState(currentSettings?.userLevel || LEVEL_PRE1);
  const [filterMode, setFilterMode] = useState<FilterMode>(currentSettings?.filterMode || FILTER_MODES.ALL);
  const [showUnassigned, setShowUnassigned] = useState(currentSettings?.showUnassigned || false);
  const [unassignedJisLevel, setUnassignedJisLevel] = useState<UnassignedJISLevel>(currentSettings?.unassignedJisLevel || JIS_LEVEL_4);

  // 設定が変更されたときにコールバックを呼ぶ
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        userLevel,
        filterMode,
        showUnassigned,
        unassignedJisLevel
      });
    }
  }, [userLevel, filterMode, showUnassigned, unassignedJisLevel, onSettingsChange]);

  const sampleTexts = [
    '今日漢検準1級の勉強をしていて「瀟洒」という美しい漢字に出会いました。',
    '漢字検定一級合格を目指して勉強中です。',
    '憂き世の感動を表現する漢字の美しさに心を奪われています。'
  ];

  const userLevelIndex = OFFICIAL_KANJI_LEVELS.indexOf(userLevel as typeof OFFICIAL_KANJI_LEVELS[number]);

  const shouldHighlight = (kanjiLevel: string): boolean => {
    if (filterMode === FILTER_MODES.ALL) return true;

    const kanjiLevelIndex = OFFICIAL_KANJI_LEVELS.indexOf(kanjiLevel as typeof OFFICIAL_KANJI_LEVELS[number]);
    if (kanjiLevelIndex === -1) return true; // 配当外は常に表示

    if (filterMode === FILTER_MODES.ABOVE) {
      return kanjiLevelIndex <= userLevelIndex;
    } else if (filterMode === FILTER_MODES.AT_OR_BELOW) {
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
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-6`}>
              <div className="space-y-2">
                <Label htmlFor="user-level">保持級</Label>
                <Select value={userLevel} onValueChange={setUserLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="保持級を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICIAL_KANJI_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-mode">フィルタ</Label>
                <Select value={filterMode} onValueChange={(value: FilterMode) => setFilterMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FILTER_MODES.ABOVE}>保持級以上を表示</SelectItem>
                    <SelectItem value={FILTER_MODES.AT_OR_BELOW}>保持級以下を表示</SelectItem>
                    <SelectItem value={FILTER_MODES.ALL}>すべて表示</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unassigned-mode">配当外漢字表示</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unassigned-mode"
                    checked={showUnassigned}
                    onCheckedChange={setShowUnassigned}
                  />
                  <Label htmlFor="unassigned-mode" className="text-sm">
                    {showUnassigned ? 'ON' : 'OFF'}
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jis-level-select" className={!showUnassigned ? 'text-gray-400' : ''}>JIS水準設定</Label>
                <Select
                  value={unassignedJisLevel}
                  onValueChange={showUnassigned ? (value: UnassignedJISLevel) => setUnassignedJisLevel(value) : undefined}
                >
                  <SelectTrigger className={!showUnassigned ? 'opacity-50 pointer-events-none' : ''}>
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

            {/* 配当級凡例 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">配当級凡例</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(LEVEL_COLORS)
                  .filter(([level]) => OFFICIAL_KANJI_LEVELS.includes(level as any))
                  .map(([level, colorClass]) => (
                    <Badge key={level} className={colorClass}>
                      {level}
                    </Badge>
                  ))}
              </div>
              <h3 className="text-sm font-semibold mb-2">配当外凡例</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LEVEL_COLORS)
                  .filter(([level]) => JIS_LEVELS.includes(level as any))
                  .map(([level, colorClass]) => (
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