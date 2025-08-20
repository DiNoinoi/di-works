/**
 * フローティング投稿ボタン関連の型定義
 */

/** 投稿選択肢の型 */
export interface PostOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

/** フローティング投稿ボタンのProps型 */
export interface FloatingPostButtonProps {
  onCreateProblemPost: () => void;
  onCreateTextPost: () => void;
}