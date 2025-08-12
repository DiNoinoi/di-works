import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Button } from '../ui/button';
import { Home, PlusCircle, User, Search, Bell, BookOpen, Eye, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { NAVIGATION_IDS } from '../../constants/navigation';

/**
 * 通常ページ用レイアウト
 * ヘッダーとモバイル用ボトムナビゲーションを含む
 */
export function AppLayout() {
  const location = useLocation();
  
  // ナビゲーション項目の定義
  const navigationItems = [
    { id: NAVIGATION_IDS.FEED, label: 'ホーム', icon: Home, path: '/' },
    { id: NAVIGATION_IDS.SEARCH, label: '検索', icon: Search, path: '/search' },
    { id: NAVIGATION_IDS.CREATE, label: '投稿作成', icon: PlusCircle, path: '/posts/create' },
    { id: NAVIGATION_IDS.KANKEN_MASTER, label: '漢検マスター', icon: Eye, path: '/kanken-master' },
    { id: NAVIGATION_IDS.DICTIONARY, label: '辞書', icon: BookOpen, path: '/dictionary' },
    { id: NAVIGATION_IDS.WEAK_KANJI, label: '苦手漢字', icon: AlertTriangle, path: '/weak-kanji' },
    { id: NAVIGATION_IDS.NOTIFICATIONS, label: '通知', icon: Bell, path: '/notifications' },
    { id: NAVIGATION_IDS.PROFILE, label: 'プロフィール', icon: User, path: '/profile' },
    { id: NAVIGATION_IDS.SETTINGS, label: '設定', icon: SettingsIcon, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header navigationItems={navigationItems} />

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* モバイル用ボトムナビゲーション */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className="flex flex-col gap-1 h-auto py-2"
              >
                <Link to={item.path}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* モバイル用のボトムスペース */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}