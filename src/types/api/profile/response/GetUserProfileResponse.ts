/**
 * プロフィール基本情報取得API用のレスポンス
 */
export interface GetUserProfileResponse {
  user_id: string;
  display_id: string;
  user_name: string;
  profile_text: string | null;
  created_at: string;
  answer_count: number;
  correct_count: number;
  post_count: number;
  follower_count: number;
  following_count: number;

  // 称号情報（title_masterから取得）
  title: {
    title_id: string;
    name: string;
    description: string | null;
  } | null;
}