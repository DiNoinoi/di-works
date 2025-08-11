/**
 * 漢字データ管理カスタムフック
 * サービス層をReactで使いやすくラップ
 */

import { useEffect, useMemo } from 'react';
import { 
  preloadKanjiData, 
  getKanjiInfo, 
  processTextKanji, 
  getCacheSize, 
  isPreloaded 
} from '../services/kanjiService';
import type { KanjiInfo, ProcessedChar } from '../types/kanji';

/**
 * 漢字データ管理フック
 */
export const useKanjiData = () => {
  // アプリ起動時にプリロード開始
  useEffect(() => {
    preloadKanjiData();
  }, []);

  // メモ化された関数群
  const kanjiService = useMemo(() => ({
    /**
     * 単一の漢字情報を取得
     */
    getInfo: async (codePoint: number): Promise<KanjiInfo | undefined> => {
      return await getKanjiInfo(codePoint);
    },

    /**
     * テキスト内の全漢字を処理
     */
    processText: async (text: string): Promise<ProcessedChar[]> => {
      return await processTextKanji(text);
    },

    /**
     * デバッグ情報を取得
     */
    getDebugInfo: () => ({
      cacheSize: getCacheSize(),
      isPreloaded: isPreloaded()
    })
  }), []);

  return kanjiService;
};

/**
 * 文字から直接漢字情報を取得するフック
 */
export const useKanjiInfo = (character: string) => {
  const { getInfo } = useKanjiData();
  
  const getCharacterInfo = async (): Promise<KanjiInfo | undefined> => {
    const codePoint = character.codePointAt(0);
    if (!codePoint) return undefined;
    
    return await getInfo(codePoint);
  };

  return { getCharacterInfo };
};