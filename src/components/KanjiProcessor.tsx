import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { getKanjiInfo } from '../constants/kanjiData';
import { LEVEL_COLORS } from '../constants/colors';
import { isKanjiCharacter } from '../utils/kanjiUtils';
import type { KanjiInfo } from '../types/kanji';
import type { FilterMode, UnassignedJISLevel } from '../types/settings';
import { KANJI_LEVELS } from '../constants/kanjiLevels';
import { FILTER_MODES } from '../constants/filterModes';
import { JIS_LEVELS, JIS_LEVEL_4 } from '../constants/jisLevels';

/**
 * 個別の漢字文字を表示するコンポーネントのProps
 */
interface KanjiCharProps {
  char: string;
  data?: KanjiInfo;
  isHighlighted: boolean;
}

/**
 * 個別の漢字文字を表示するコンポーネント
 * 漢検マスターモードが有効な場合、漢字に色付けしてツールチップで詳細情報を表示
 */
const KanjiChar: React.FC<KanjiCharProps> = ({ char, data, isHighlighted }) => {
  // 漢字データがないか、ハイライト対象外の場合は通常表示
  if (!data || !isHighlighted) {
    return <span>{char}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`px-1 rounded ${LEVEL_COLORS[data.level]} cursor-pointer transition-all hover:shadow-sm`}>
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

/**
 * 漢字処理コンポーネントのProps
 */
interface KanjiProcessorProps {
  text: string;                         // 処理対象のテキスト
  userLevel?: string;                   // ユーザーの保持級（デフォルト: 準1級）
  filterMode?: FilterMode;              // フィルタモード（デフォルト: すべて表示）
  showMode?: boolean;                   // 漢検マスターモードの有効/無効
  showUnassigned?: boolean;             // 配当外漢字表示の有効/無効
  unassignedJisLevel?: UnassignedJISLevel; // 配当外漢字のJIS水準制御
  className?: string;                   // 追加のCSSクラス
}

/**
 * 漢字処理メインコンポーネント
 * テキスト内の漢字を検出し、漢検マスターモード設定に応じて色分け表示する
 */
export function KanjiProcessor({ 
  text, 
  userLevel = '準1級', 
  filterMode = FILTER_MODES.ALL, 
  showMode = true,
  showUnassigned = false,
  unassignedJisLevel = JIS_LEVEL_4,
  className = ''
}: KanjiProcessorProps) {
  // ユーザーの保持級のインデックスを取得（級の序列判定に使用）
  const userLevelIndex = KANJI_LEVELS.indexOf(userLevel as typeof KANJI_LEVELS[number]);

  /**
   * 配当外漢字（JIS水準）かどうかを判定
   * @param level - 漢字のレベル
   * @returns 配当外漢字かどうか
   */
  const isUnassignedKanji = (level: string): boolean => {
    return JIS_LEVELS.includes(level as UnassignedJISLevel);
  };

  /**
   * 配当外漢字のJIS水準フィルタ判定
   * @param jisLevel - 漢字のJIS水準
   * @returns 表示対象かどうか
   */
  const shouldShowUnassignedJIS = (jisLevel: string): boolean => {
    const jisLevelIndex = JIS_LEVELS.indexOf(jisLevel as UnassignedJISLevel);
    const maxJisLevelIndex = JIS_LEVELS.indexOf(unassignedJisLevel);
    // 設定されたJIS水準以下（より基本的な水準）を表示
    return jisLevelIndex <= maxJisLevelIndex;
  };

  /**
   * 漢字をハイライト表示するかどうかを判定
   * @param kanjiLevel - 漢字の配当級またはJIS水準
   * @returns ハイライト表示するかどうか
   */
  const shouldHighlight = (kanjiLevel: string): boolean => {
    // 漢検マスターモードが無効な場合はハイライトしない
    if (!showMode) return false;
    
    // 配当外漢字の場合は独立した判定
    if (isUnassignedKanji(kanjiLevel)) {
      return showUnassigned && shouldShowUnassignedJIS(kanjiLevel);
    }
    
    // 漢検配当内漢字の場合
    // 「すべて表示」モードの場合は常にハイライト
    if (filterMode === FILTER_MODES.ALL) return true;
    
    const kanjiLevelIndex = KANJI_LEVELS.indexOf(kanjiLevel as typeof KANJI_LEVELS[number]);
    // 想定外のレベルの場合は非表示
    if (kanjiLevelIndex === -1) return false;
    
    if (filterMode === FILTER_MODES.ABOVE) {
      // 保持級以上（より難しい級）の漢字を表示
      return kanjiLevelIndex <= userLevelIndex;
    } else if (filterMode === FILTER_MODES.AT_OR_BELOW) {
      // 保持級以下（より簡単な級）の漢字を表示  
      return kanjiLevelIndex >= userLevelIndex;
    } else {
      return true;
    }
  };

  /**
   * テキストを文字単位で処理し、漢字に対して適切な表示コンポーネントを返す
   * @param text - 処理対象のテキスト
   * @returns JSX要素の配列
   */
  const processText = (text: string) => {
    return text.split('').map((char, index) => {
      // 漢字以外の文字は通常のspanで表示
      if (!isKanjiCharacter(char)) {
        return <span key={index}>{char}</span>;
      }
      
      // 漢字の詳細情報を取得
      const data = getKanjiInfo(char);
      // ハイライト対象かどうか判定
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
      <span className={className}>
        {processText(text)}
      </span>
    </TooltipProvider>
  );
}