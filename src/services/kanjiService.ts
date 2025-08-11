/**
 * 漢字データサービス（関数ベースアプローチ）
 * シンプルプリロード + メモリキャッシュ方式
 */

import type { KanjiInfo, KanjiDataCollection, ProcessedChar } from '../types/kanji';

// メモリキャッシュ（Map）
let kanjiCache = new Map<number, KanjiInfo>();

// 読み込み済みJSONデータ
let kanjiData: KanjiDataCollection | null = null;

// プリロード中フラグ
let isLoading = false;

/**
 * バックグラウンドプリロード（アプリ起動時に実行）
 */
export const preloadKanjiData = async (): Promise<void> => {
  if (isLoading || kanjiData) return;
  isLoading = true;
  
  try {
    // 作成したJSONファイルから直接読み込み
    kanjiData = await import('../data/kanji-data.json').then(m => m.default);
    console.log('✅ Kanji data preloaded successfully');
  } catch (error) {
    console.error('❌ Preload failed:', error);
  } finally {
    isLoading = false;
  }
};

/**
 * 指定した文字コードの漢字情報を取得
 */
export const getKanjiInfo = async (codePoint: number): Promise<KanjiInfo | undefined> => {
  // 1. メモリキャッシュチェック（最速）
  if (kanjiCache.has(codePoint)) {
    return kanjiCache.get(codePoint);
  }

  // 2. プリロード完了待ち（初回のみ）
  if (!kanjiData) {
    await preloadKanjiData();
  }

  // 3. データ取得とキャッシュ保存
  const key = `0x${codePoint.toString(16).toUpperCase()}`;
  const info = kanjiData?.[key];
  
  if (info) {
    kanjiCache.set(codePoint, info);
  }
  
  return info;
};

/**
 * 文字列内のすべての漢字情報を一括取得
 */
export const processTextKanji = async (text: string): Promise<ProcessedChar[]> => {
  const results: ProcessedChar[] = [];
  
  for (const char of text) {
    const codePoint = char.codePointAt(0) || 0;
    let info: KanjiInfo | undefined;
    
    if (isKanji(codePoint)) {
      info = await getKanjiInfo(codePoint);
    }
    
    results.push({ char, info, codePoint });
  }
  
  return results;
};

/**
 * 漢字かどうかの判定
 */
export const isKanji = (codePoint: number): boolean => {
  return (
    (codePoint >= 0x4e00 && codePoint <= 0x9faf) || // CJK統合漢字
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) || // CJK拡張A
    (codePoint >= 0x20000 && codePoint <= 0x2a6df)  // CJK拡張B
  );
};

/**
 * キャッシュサイズを取得（デバッグ用）
 */
export const getCacheSize = (): number => {
  return kanjiCache.size;
};

/**
 * キャッシュをクリア（デバッグ用）
 */
export const clearCache = (): void => {
  kanjiCache.clear();
};

/**
 * プリロード状態を取得（デバッグ用）
 */
export const isPreloaded = (): boolean => {
  return kanjiData !== null;
};