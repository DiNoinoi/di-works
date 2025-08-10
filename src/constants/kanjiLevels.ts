/**
 * 漢字検定の級定数
 */

// 個々の級の定数定義
export const LEVEL_10 = '10級';
export const LEVEL_9 = '9級';
export const LEVEL_8 = '8級';
export const LEVEL_7 = '7級';
export const LEVEL_6 = '6級';
export const LEVEL_5 = '5級';
export const LEVEL_4 = '4級';
export const LEVEL_3 = '3級';
export const LEVEL_PRE2 = '準2級';
export const LEVEL_2 = '2級';
export const LEVEL_PRE1 = '準1級';
export const LEVEL_1 = '1級';
export const LEVEL_UNASSIGNED = '配当外';

/**
 * 漢字検定の級一覧（易しい順・配当外含む）
 */
export const KANJI_LEVELS = [
  LEVEL_10, LEVEL_9, LEVEL_8, LEVEL_7, LEVEL_6, LEVEL_5,
  LEVEL_4, LEVEL_3, LEVEL_PRE2, LEVEL_2, LEVEL_PRE1, LEVEL_1,
  LEVEL_UNASSIGNED
] as const;

/**
 * 漢字検定の級のみ一覧（易しい順・配当外含む）
 */
export const OFFICIAL_KANJI_LEVELS = [
  LEVEL_10, LEVEL_9, LEVEL_8, LEVEL_7, LEVEL_6, LEVEL_5,
  LEVEL_4, LEVEL_3, LEVEL_PRE2, LEVEL_2, LEVEL_PRE1, LEVEL_1
] as const;

/**
 * 配当外を除くかどうかのフィルタ判定
 */
export const isOfficialLevel = (level: string): boolean => {
  return level !== LEVEL_UNASSIGNED;
};