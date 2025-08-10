/**
 * ユーザー関連の型定義
 * API実装時にはサーバーサイドの定義と同期する
 */

/**
 * 基本ユーザー情報
 */
export interface User {
  /** ユーザーID */
  id: string;
  /** ユーザー名（表示名） */
  name: string;
  /** ユーザーネーム（@username） */
  username: string;
  /** プロフィール画像URL */
  avatarUrl?: string;
  /** メールアドレス */
  email: string;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}

/**
 * 詳細ユーザープロフィール情報
 */
export interface UserProfile extends User {
  /** 自己紹介文 */
  bio?: string;
  /** 現在の漢検レベル */
  kankenLevel?: string;
  /** 目標漢検レベル */
  targetKankenLevel?: string;
  /** 学習開始日 */
  studyStartDate?: string;
  /** フォロワー数 */
  followersCount: number;
  /** フォロー中の数 */
  followingCount: number;
  /** 投稿数 */
  postsCount: number;
  /** 獲得ポイント */
  totalPoints: number;
}

/**
 * 認証状態の型
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * 認証コンテキストの型
 */
export interface AuthContextType {
  /** 認証状態 */
  status: AuthStatus;
  /** 現在のユーザー情報 */
  user: User | null;
  /** ログイン関数 */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** ログアウト関数 */
  logout: () => Promise<void>;
}

/**
 * ログイン認証情報
 */
export interface LoginCredentials {
  /** メールアドレスまたはユーザーネーム */
  identifier: string;
  /** パスワード */
  password: string;
}