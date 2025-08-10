/**
 * Unicode範囲による厳密な漢字判定
 * 日本語における漢字の主要なUnicode範囲をカバー
 */

/**
 * 文字が漢字かどうかを判定
 */
export const isKanjiCharacter = (char: string): boolean => {
  const code = char.codePointAt(0);
  if (!code) return false;
  
  return (
    (code >= 0x4E00 && code <= 0x9FFF) ||  // CJK統合漢字 (基本的な漢字)
    (code >= 0x3400 && code <= 0x4DBF) ||  // CJK拡張A (古代中国の漢字等)
    (code >= 0x20000 && code <= 0x2A6DF) ||// CJK拡張B (更に古い漢字)
    (code >= 0x2A700 && code <= 0x2B73F) ||// CJK拡張C
    (code >= 0x2B740 && code <= 0x2B81F) ||// CJK拡張D
    (code >= 0x2B820 && code <= 0x2CEAF) ||// CJK拡張E
    (code >= 0x2CEB0 && code <= 0x2EBEF) ||// CJK拡張F
    (code >= 0x30000 && code <= 0x3134F)   // CJK拡張G
  );
};

/**
 * 文字のUnicodeコードポイントを取得
 */
export const getCodePoint = (char: string): number | undefined => {
  return char.codePointAt(0);
};

/**
 * Unicodeコードポイントから文字を取得
 */
export const fromCodePoint = (codePoint: number): string => {
  return String.fromCodePoint(codePoint);
};

/**
 * テキスト内の漢字のみを抽出
 */
export const extractKanjiCharacters = (text: string): string[] => {
  return Array.from(text).filter(char => isKanjiCharacter(char));
};