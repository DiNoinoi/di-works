import { KANJI_LEVELS } from '../constants/kanjiLevels';

/**
 * 漢字情報の型定義
 */
export interface KanjiInfo {
  level: string;
  reading: string;
  meaning: string;
}

/**
 * 漢字検定の級の型
 */
export type KanjiLevel = typeof KANJI_LEVELS[number];