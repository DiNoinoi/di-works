/**
 * 漢字データ関連の型定義
 */

/**
 * 読み情報（表内読み・表外読みを分離）
 */
export interface ReadingInfo {
  hyonai: string[];  // 表内読み
  hyogai: string[];  // 表外読み
}

/**
 * 漢字情報
 */
export interface KanjiInfo {
  character: string;           // 漢字文字
  level: string;              // 配当級（例: "3級", "準1級", "配当外"）
  onYomi: ReadingInfo;        // 音読み
  kunYomi: ReadingInfo;       // 訓読み
  meanings: string[];         // 意味
  examples: string[];         // 用例
  jisLevel: string;          // JIS水準（例: "JIS第1水準"）
}

/**
 * 漢字データコレクション（Unicode文字コードをキー）
 */
export type KanjiDataCollection = Record<string, KanjiInfo>;

/**
 * 文字列処理結果
 */
export interface ProcessedChar {
  char: string;              // 元の文字
  info: KanjiInfo | undefined;  // 漢字情報（漢字以外はundefined）
  codePoint: number;         // Unicode文字コード
}

/**
 * テキスト処理結果
 */
export interface ProcessedText {
  originalText: string;      // 元のテキスト
  characters: ProcessedChar[]; // 文字ごとの処理結果
}

/**
 * キャッシュ統計情報（デバッグ用）
 */
export interface CacheStats {
  size: number;              // キャッシュされた文字数
  hitCount: number;          // キャッシュヒット数
  missCount: number;         // キャッシュミス数
  hitRate: number;           // ヒット率（%）
}