import { KANJI_KENTEI_LEVEL_NAME, KANJI_KENTEI_LEVEL_ID } from './kanjiLevels';
import { JIS_LEVEL_1, JIS_LEVEL_2, JIS_LEVEL_3, JIS_LEVEL_4 } from './jisLevels';

/**
 * 漢字検定の級別色定義（Tailwind CSS）
 * KanjiProcessor.tsx、KanjiMasterMode.tsx、UserDictionary.tsxの重複を統合
 */
export const LEVEL_COLORS: { [key: string]: string } = {
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_10]: 'bg-green-100 text-green-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_9]: 'bg-green-200 text-green-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_8]: 'bg-blue-100 text-blue-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_7]: 'bg-blue-200 text-blue-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_6]: 'bg-cyan-100 text-cyan-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_5]: 'bg-pink-100 text-pink-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_4]: 'bg-indigo-100 text-indigo-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_3]: 'bg-yellow-100 text-yellow-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE2]: 'bg-orange-200 text-orange-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_2]: 'bg-orange-100 text-orange-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE1]: 'bg-red-100 text-red-800',
  [KANJI_KENTEI_LEVEL_NAME.LEVEL_1]: 'bg-red-200 text-red-800',

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
  return LEVEL_COLORS[level] || LEVEL_COLORS[KANJI_KENTEI_LEVEL_NAME.LEVEL_UNASSIGNED];
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
  'focus-visible:border-[#cecece]',
  'focus-visible:border-2',
  'focus-visible:ring-0',
  'transition-all',
  'duration-75',
  'ease-in'
].join(' ');

/**
 * セレクトフィールドのTailwindクラス文字列を取得
 */
export const getSelectClasses = () => [
  'border-gray-300',
  'focus:border-[#cecece]',
  'focus:border-2',
  'focus:ring-0',
  'data-[state=open]:border-[#cecece]',
  'data-[state=open]:border-2',
  'transition-all',
  'duration-75',
  'ease-in'
].join(' ');

/**
 * テキストエリアのTailwindクラス文字列を取得
 */
export const getTextareaClasses = () => [
  'border-2',
  'border-transparent',
  'ring-1',
  'ring-gray-300',
  'placeholder:text-gray-400',
  'focus-visible:border-[#cecece]',
  'focus-visible:ring-0',
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

/**
 * プロフィールページ用の級別バッジ色定義
 */
export const PROFILE_LEVEL_COLORS: { [key: string]: string } = {
  [KANJI_KENTEI_LEVEL_ID.LEVEL_1]: 'bg-purple-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_PRE1]: 'bg-indigo-600', 
  [KANJI_KENTEI_LEVEL_ID.LEVEL_2]: 'bg-blue-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_PRE2]: 'bg-green-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_3]: 'bg-yellow-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_4]: 'bg-orange-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_5]: 'bg-red-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_6]: 'bg-pink-600',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_7]: 'bg-purple-500',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_8]: 'bg-indigo-500',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_9]: 'bg-blue-500',
  [KANJI_KENTEI_LEVEL_ID.LEVEL_10]: 'bg-gray-500',
};