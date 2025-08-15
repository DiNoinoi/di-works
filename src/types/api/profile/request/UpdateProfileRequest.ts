/**
 * プロフィール更新API用のリクエスト型
 */
export interface UpdateProfileRequest {
  display_id?: string;
  user_name?: string;
  birth_date?: string;
  birth_date_public?: boolean;
  profile_text?: string;
  avatar_url?: string;
  kanji_kentei_level?: string;
}