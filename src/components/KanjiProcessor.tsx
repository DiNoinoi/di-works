import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { getLevelColor } from '../constants/colors';
import { useKanjiData } from '../hooks/useKanjiData';
import type { KanjiInfo, ProcessedChar } from '../types/kanji';
import type { FilterMode, UnassignedJISLevel } from '../types/settings';
import { OFFICIAL_KANJI_LEVELS, LEVEL_UNASSIGNED } from '../constants/kanjiLevels';
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

  // 読み情報を表内読み・表外読みで統合
  const allOnYomi = [...data.onYomi.hyonai, ...data.onYomi.hyogai];
  const allKunYomi = [...data.kunYomi.hyonai, ...data.kunYomi.hyogai];
  const readingText = [...allOnYomi, ...allKunYomi].join('・') || '不明';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`px-1 rounded ${data.level === LEVEL_UNASSIGNED ? getLevelColor(data.jisLevel) : getLevelColor(data.level)} cursor-pointer transition-all hover:shadow-sm`}>
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
            <div><strong>読み:</strong> {readingText}</div>
            <div><strong>意味:</strong> {data.meanings.join('、')}</div>
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
  const { processText: processKanjiText } = useKanjiData();
  const [processedChars, setProcessedChars] = useState<ProcessedChar[]>([]);

  // ユーザーの保持級のインデックスを取得（級の序列判定に使用）
  const userLevelIndex = OFFICIAL_KANJI_LEVELS.indexOf(userLevel as typeof OFFICIAL_KANJI_LEVELS[number]);

  /**
   * 配当外漢字かどうかを判定
   * @param level - 漢字のレベル
   * @returns 配当外漢字かどうか
   */
  const isUnassignedKanji = (level: string): boolean => {
    return level === LEVEL_UNASSIGNED;
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
   * @param info - 漢字情報オブジェクト
   * @returns ハイライト表示するかどうか
   */
  const shouldHighlight = (info: KanjiInfo): boolean => {
    // 漢検マスターモードが無効な場合はハイライトしない
    if (!showMode) return false;

    // 配当外漢字の場合は独立した判定
    if (isUnassignedKanji(info.level)) {
      return showUnassigned && shouldShowUnassignedJIS(info.jisLevel);
    }

    // 漢検配当内漢字の場合
    // 「すべて表示」モードの場合は常にハイライト
    if (filterMode === FILTER_MODES.ALL) return true;

    const kanjiLevelIndex = OFFICIAL_KANJI_LEVELS.indexOf(info.level as typeof OFFICIAL_KANJI_LEVELS[number]);
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

  // テキストが変更されたときに非同期で漢字データを処理
  useEffect(() => {
    const processTextAsync = async () => {
      const chars = await processKanjiText(text);
      setProcessedChars(chars);
    };
    
    processTextAsync();
  }, [text, processKanjiText]);

  /**
   * 処理済み文字データからJSX要素を生成
   */
  const renderProcessedText = () => {
    return processedChars.map((charData, index) => {
      const { char, info } = charData;
      
      // 漢字以外の文字は通常のspanで表示
      if (!info) {
        return <span key={index}>{char}</span>;
      }
      
      // ハイライト対象かどうか判定
      const isHighlighted = shouldHighlight(info);
      
      return (
        <KanjiChar
          key={index}
          char={char}
          data={info}
          isHighlighted={isHighlighted}
        />
      );
    });
  };

  return (
    <TooltipProvider>
      <span className={className}>
        {renderProcessedText()}
      </span>
    </TooltipProvider>
  );
}