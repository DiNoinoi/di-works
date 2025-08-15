/**
 * プロフィール基本情報取得API用のレスポンス型
 */
export interface UserProfileBasicResponse {
  user_id: string;
  display_id: string;
  user_name: string;
  profile_text?: string;
  created_at: string;
  answer_count: number;
  correct_count: number;
  post_count: number;
  follower_count: number;
  following_count: number;
}