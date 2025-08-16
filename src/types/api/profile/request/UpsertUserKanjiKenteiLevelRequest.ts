/**
 * ユーザー漢字検定級別合格回数upsertリクエスト型
 */
export interface UpsertUserKanjiKenteiLevelRequest {
  user_id: string;
  kanji_kentei_level_id: string;
  passed_count: number;
}