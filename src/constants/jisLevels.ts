/**
 * JIS漢字水準定数
 * 配当外漢字の分類に使用（JIS X 0208, JIS X 0213 準拠）
 */
export const JIS_LEVEL_1 = 'JIS1';
export const JIS_LEVEL_2 = 'JIS2';
export const JIS_LEVEL_3 = 'JIS3';
export const JIS_LEVEL_4 = 'JIS4';

export const JIS_LEVELS = [JIS_LEVEL_1, JIS_LEVEL_2, JIS_LEVEL_3, JIS_LEVEL_4] as const;

/**
 * JIS水準の表示ラベル
 */
export const JIS_LEVEL_LABELS = {
  [JIS_LEVEL_1]: 'JIS第1水準',
  [JIS_LEVEL_2]: 'JIS第2水準',
  [JIS_LEVEL_3]: 'JIS第3水準',
  [JIS_LEVEL_4]: 'JIS第4水準'
} as const;

/**
 * JIS水準の階層順序（易しい順）
 * インデックスが小さいほど基本的な漢字
 */
export const JIS_LEVEL_HIERARCHY = JIS_LEVELS;

/**
 * デフォルトのJIS水準設定（第4水準まで＝全表示）
 * 配当外漢字を表示したいユーザーは基本的に全部見たいニーズが多い
 */
export const DEFAULT_JIS_LEVEL = JIS_LEVEL_4;