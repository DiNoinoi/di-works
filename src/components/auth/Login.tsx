import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api/auth';
import { getInputClasses, getPrimaryButtonClasses } from '@/constants/colors';

/**
 * ログインコンポーネント
 * メールアドレスとパスワードでログイン
 */
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.signIn(email, password);
      
      // プロフィール作成画面以外の場合のみホーム画面に遷移
      if (!location.pathname.includes('/auth/profile-setup')) {
        navigate('/');
      }
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      console.error('ログインエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">ログイン</h2>
        <p className="text-gray-600 mt-2">アカウントにログインしてください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: kanji@example.com"
            className={getInputClasses()}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
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
              ログイン中...
            </div>
          ) : (
            'ログイン'
          )}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link
          to="/auth/reset"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          パスワードを忘れた場合
        </Link>

        <div className="text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link
            to="/auth/signup"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            こちら
          </Link>
        </div>
      </div>
    </div>
  );
}