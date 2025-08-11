import type { NavigationItem } from '../types/navigation';
import { Home, PlusCircle, User, Search, Bell, BookOpen, Eye, AlertTriangle, Settings } from 'lucide-react';

/**
 * ナビゲーションID定数
 */
export const NAVIGATION_IDS = {
  FEED: 'feed',
  SEARCH: 'search',
  CREATE: 'create',
  KANKEN_MASTER: 'kanken-master',
  DICTIONARY: 'dictionary',
  WEAK_KANJI: 'weak-kanji',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  POST_DETAIL: 'post-detail'
} as const;

/**
 * ナビゲーションアイテムの定義
 * App.tsx のnavigationItems配列を一元管理
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: NAVIGATION_IDS.FEED, label: 'ホーム', icon: Home },
  { id: NAVIGATION_IDS.SEARCH, label: '検索', icon: Search },
  { id: NAVIGATION_IDS.CREATE, label: '投稿作成', icon: PlusCircle },
  { id: NAVIGATION_IDS.KANKEN_MASTER, label: '漢検マスター', icon: Eye },
  { id: NAVIGATION_IDS.DICTIONARY, label: '辞書', icon: BookOpen },
  { id: NAVIGATION_IDS.WEAK_KANJI, label: '苦手漢字', icon: AlertTriangle },
  { id: NAVIGATION_IDS.NOTIFICATIONS, label: '通知', icon: Bell },
  { id: NAVIGATION_IDS.PROFILE, label: 'プロフィール', icon: User },
  { id: NAVIGATION_IDS.SETTINGS, label: '設定', icon: Settings },
];

/**
 * デバイス別ナビゲーション表示設定（任意の順序・組み合わせ）
 */
export const DESKTOP_NAV_IDS = [
  NAVIGATION_IDS.FEED, 
  NAVIGATION_IDS.SEARCH, 
  NAVIGATION_IDS.CREATE, 
  NAVIGATION_IDS.KANKEN_MASTER, 
  NAVIGATION_IDS.DICTIONARY
];

export const TABLET_NAV_IDS = [
  NAVIGATION_IDS.FEED, 
  NAVIGATION_IDS.CREATE, 
  NAVIGATION_IDS.PROFILE
];

export const MOBILE_NAV_IDS = [
  NAVIGATION_IDS.FEED, 
  NAVIGATION_IDS.SEARCH, 
  NAVIGATION_IDS.CREATE, 
  NAVIGATION_IDS.NOTIFICATIONS, 
  NAVIGATION_IDS.PROFILE
];