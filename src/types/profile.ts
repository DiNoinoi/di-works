/**
 * プロフィール作成用の型定義
 */
export interface ProfileFormData {
  displayId: string; // ユーザー一意の表示用ID（@username）
  username: string; // 表示名
  birthDate: string; // 生年月日（YYYY-MM-DD形式）
  birthDatePublic: boolean; // 生年月日の公開可否フラグ
  profileText: string; // プロフィール文
  avatarUrl: string; // プロフィール画像のURL
  kanjiKenteiLevel: string; // 漢字検定の保持級
}

