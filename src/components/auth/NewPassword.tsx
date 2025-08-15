import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api/auth';
import { getInputClasses, getPrimaryButtonClasses } from '@/constants/colors';

/**
 * 新パスワード設定コンポーネント
 * パスワードリセットメールからのリンク遷移後に新パスワードを設定
 */
export function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    // パスワード強度チェック
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      await authService.updatePassword(password);
      
      // プロフィール作成画面以外の場合のみホーム画面に遷移
      if (!location.pathname.includes('/auth/profile-setup')) {
        navigate('/');
      }
    } catch (error) {
      setError('パスワードの更新に失敗しました。再度お試しください。');
      console.error('パスワード更新エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">新しいパスワード</h2>
        <p className="text-gray-600 mt-2">新しいパスワードを設定してください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">新しいパスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上のパスワード"
            className={getInputClasses()}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">パスワード確認</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="パスワードを再入力"
            className={getInputClasses()}
            required
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className={`w-full ${getPrimaryButtonClasses()}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              更新中...
            </div>
          ) : (
            'パスワードを更新'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          パスワードを更新すると自動的にログインされます
        </p>
      </div>
    </div>
  );
}