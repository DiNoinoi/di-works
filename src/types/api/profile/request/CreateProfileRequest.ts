/**
 * プロフィール作成API用のリクエスト型
 */
export interface CreateProfileRequest {
  user_id: string;
  display_id: string;
  username: string;
  birth_date?: string;
  birth_date_public: boolean;
  profile_text?: string;
  avatar_url?: string;
  kanji_kentei_level?: string;
}