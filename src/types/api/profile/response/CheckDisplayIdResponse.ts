/**
 * ユーザーID重複チェックAPI用のレスポンス型
 */
export interface CheckDisplayIdResponse {
  isAvailable: boolean;
  message?: string;
}