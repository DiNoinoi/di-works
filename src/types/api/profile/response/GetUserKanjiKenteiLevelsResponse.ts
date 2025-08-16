/**
 * ユーザーの検定級別合格数取得API用のレスポンス型
 */
export interface GetUserKanjiKenteiLevelsResponse {
  kanji_kentei_level_id: string;
  kanji_kentei_level_name: string;
  level_order: number;
  passed_count: number;
}