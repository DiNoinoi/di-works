/**
 * ユーザーバッジ取得APIのレスポンス型
 */
export interface GetUserBadgesResponse {
  badge_id: string;
  name: string;
  description: string;
  icon_url: string | null;
  earned_at: string; // ISO 8601 date string
}