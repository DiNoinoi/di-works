import {
  LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6, LEVEL_7, LEVEL_8, LEVEL_9, LEVEL_10,
  LEVEL_PRE1, LEVEL_PRE2, LEVEL_UNASSIGNED
} from './kanjiLevels';
import { JIS_LEVEL_1, JIS_LEVEL_2, JIS_LEVEL_3, JIS_LEVEL_4 } from './jisLevels';

/**
 * 漢字検定の級別色定義（Tailwind CSS）
 * KanjiProcessor.tsx、KanjiMasterMode.tsx、UserDictionary.tsxの重複を統合
 */
export const LEVEL_COLORS: { [key: string]: string } = {
  [LEVEL_10]: 'bg-green-100 text-green-800',
  [LEVEL_9]: 'bg-green-200 text-green-800',
  [LEVEL_8]: 'bg-blue-100 text-blue-800',
  [LEVEL_7]: 'bg-blue-200 text-blue-800',
  [LEVEL_6]: 'bg-cyan-100 text-cyan-800',
  [LEVEL_5]: 'bg-pink-100 text-pink-800',
  [LEVEL_4]: 'bg-indigo-100 text-indigo-800',
  [LEVEL_3]: 'bg-yellow-100 text-yellow-800',
  [LEVEL_PRE2]: 'bg-orange-200 text-orange-800',
  [LEVEL_2]: 'bg-orange-100 text-orange-800',
  [LEVEL_PRE1]: 'bg-red-100 text-red-800',
  [LEVEL_1]: 'bg-red-200 text-red-800',

  // 配当外漢字JIS水準の色（紫系統で特別感を演出）
  [JIS_LEVEL_1]: 'bg-violet-100 text-violet-800',
  [JIS_LEVEL_2]: 'bg-violet-200 text-violet-800',
  [JIS_LEVEL_3]: 'bg-purple-300 text-purple-900',
  [JIS_LEVEL_4]: 'bg-purple-400 text-purple-900'
};

/**
 * 指定した級の色を取得
 */
export const getLevelColor = (level: string): string => {
  return LEVEL_COLORS[level] || LEVEL_COLORS[LEVEL_UNASSIGNED];
};

// 入力フィールド用カラー
export const INPUT_COLORS = {
  BORDER: '#d1d5db',
  BORDER_FOCUS: '#cecece',
  PLACEHOLDER: '#9ca3af',
} as const;

// ボタン用カラー
export const BUTTON_COLORS = {
  PRIMARY: '#3b82f6',
  PRIMARY_HOVER: '#2563eb',
} as const;

/**
 * 入力フィールドのTailwindクラス文字列を取得
 */
export const getInputClasses = () => [
  'border-gray-300',
  'placeholder:text-gray-400',
  `focus-visible:!border-[${INPUT_COLORS.BORDER_FOCUS}]`,
  'focus-visible:!border-2',
  'focus-visible:!ring-0',
  'transition-all',
  'duration-75',
  'ease-in'
].join(' ');

/**
 * プライマリボタンのTailwindクラス文字列を取得
 */
export const getPrimaryButtonClasses = () => [
  'bg-blue-500',
  'hover:bg-blue-600',
  'text-white'
].join(' ');