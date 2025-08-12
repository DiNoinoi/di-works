import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
// import { authService } from '../../services/api/auth';
import { NAVIGATION_IDS } from '../../constants/navigation';
import { APP_NAME } from '../../constants/app';

interface HeaderProps {
  /** 現在のビュー */
  currentView: string;
  /** ビュー変更関数 */
  onViewChange: (viewId: string) => void;
  /** ナビゲーション項目 */
  navigationItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

/**
 * アプリケーションヘッダーコンポーネント
 * ロゴ、ナビゲーション、プロフィールドロップダウンを含む
 */
export function Header({ currentView, onViewChange, navigationItems }: HeaderProps) {
  // 一時的にモックデータを使用
  const user = {
    name: '漢字太郎',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };
  const isLoading = false;

  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    // 本実装時:
    // try {
    //   await authService.signOut();
    //   // 必要に応じてページリロードまたはログイン画面へリダイレクト
    // } catch (error) {
    //   console.error('ログアウトエラー:', error);
    // }
    
    console.log('ログアウト処理（未実装）');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ部分 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
              漢
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* デスクトップ用ナビゲーション */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* プロフィールドロップダウンメニュー */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 p-1"
                  disabled={isLoading}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage 
                      src={user?.avatarUrl} 
                      alt={user?.name || 'ユーザー'} 
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">
                    {user?.name || 'ローディング...'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-48 z-50"
                sideOffset={5}
                avoidCollisions={true}
              >
                <DropdownMenuItem 
                  onClick={() => onViewChange(NAVIGATION_IDS.PROFILE)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  プロフィール
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onViewChange(NAVIGATION_IDS.SETTINGS)}
                  className="flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" />
                  設定
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* タブレット用ナビゲーション */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            {navigationItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}