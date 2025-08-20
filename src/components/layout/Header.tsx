import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, ChevronDown, Settings as SettingsIcon, Eye } from 'lucide-react';
import { authService } from '@/services/api/auth';
import { profileService } from '@/services/api/profile';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { APP_NAME } from '@/constants/app';

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
  const { userId } = useLoginUserStore();
  const [user, setUser] = useState<{ name: string; avatarUrl: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const profileData = await profileService.getUserProfile(userId);
        setUser({
          name: profileData.user_name,
          avatarUrl: profileData.avatar_url
        });
      } catch (error) {
        console.error('ヘッダーユーザー情報取得エラー:', error);
        setUser({
          name: 'ユーザー',
          avatarUrl: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

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
                className="w-56 z-50 border-gray-300 p-0"
                sideOffset={5}
                avoidCollisions={true}
              >
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer py-3 border-b border-gray-200 -mx-2">
                    <div className="flex items-center gap-2 px-4">
                      <User className="w-4 h-4" />
                      プロフィール
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/kanken-master" className="cursor-pointer py-3 border-b border-gray-200 -mx-2">
                    <div className="flex items-center gap-2 px-4">
                      <Eye className="w-4 h-4" />
                      漢検マスターモード設定
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer py-3 border-b border-gray-200 -mx-2">
                    <div className="flex items-center gap-2 px-4">
                      <SettingsIcon className="w-4 h-4" />
                      設定
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer py-3"
                >
                  <div className="flex items-center gap-2 px-4">
                    <span>ログアウト</span>
                  </div>
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