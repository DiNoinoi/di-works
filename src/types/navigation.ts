import { LucideIcon } from 'lucide-react';

/**
 * ナビゲーションアイテムの型定義
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}