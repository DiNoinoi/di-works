import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { TooltipProvider } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Eye } from 'lucide-react';

// 新しい統合constants
import { OFFICIAL_KANJI_LEVELS } from '../constants/kanjiLevels';
import { FILTER_MODES } from '../constants/filterModes';
import { JIS_LEVELS, JIS_LEVEL_LABELS, JIS_LEVEL_4 } from '../constants/jisLevels';
import { LEVEL_PRE1 } from '../constants/kanjiLevels';
import { LEVEL_COLORS } from '../constants/colors';
import { KanjiProcessor } from './KanjiProcessor';
import type { MasterModeSettings, FilterMode, UnassignedJISLevel } from '../types/settings';


// KanjiCharコンポーネントは削除し、KanjiProcessorを使用

interface KankenMasterModeProps {
  onSettingsChange?: (settings: MasterModeSettings) => void;
  currentSettings?: MasterModeSettings;
}

export function KankenMasterMode({ onSettingsChange, currentSettings }: KankenMasterModeProps) {
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
    '憂き世の感動を表現する漢字の美しさに心を奪われています。碕栢'
  ];

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* 漢字マスターモード説明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              漢検マスターモード
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
                      {JIS_LEVEL_LABELS[level as keyof typeof JIS_LEVEL_LABELS]}
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
                    <KanjiProcessor
                      text={text}
                      userLevel={userLevel}
                      filterMode={filterMode}
                      showMode={true}
                      showUnassigned={showUnassigned}
                      unassignedJisLevel={unassignedJisLevel}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}