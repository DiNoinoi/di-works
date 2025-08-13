import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { authService } from '../../services/api/auth';
import { APP_NAME } from '../../constants/app';

interface HeaderProps {
  /** ナビゲーション項目 */
  navigationItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
  }>;
}

/**
 * アプリケーションヘッダーコンポーネント
 * ロゴ、ナビゲーション、プロフィールドロップダウンを含む
 */
export function Header({ navigationItems }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
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
    try {
      await authService.signOut();
      navigate('/'); // ホーム画面へリダイレクト
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
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
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
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
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    プロフィール
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    設定
                  </Link>
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
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link to={item.path}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}