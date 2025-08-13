import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authService } from '../../services/api/auth';
import { getInputClasses, getPrimaryButtonClasses } from '../../constants/colors';

/**
 * サインアップコンポーネント
 * メールアドレスとパスワードでアカウント作成
 */
export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

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

    try {
      await authService.signUp(email, password);
      setIsSuccess(true);
    } catch (error) {
      setError('アカウント作成に失敗しました。メールアドレスを確認してください。');
      console.error('サインアップエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-2">確認メールを送信しました</h2>
          <p className="text-green-700 mb-4">
            {email} に確認メールを送信しました。
          </p>
          <p className="text-sm text-green-600">
            メール内のリンクをクリックしてアカウントを有効化してください。
          </p>
        </div>
        
        <Link
          to="/auth/login"
          className="inline-block text-blue-600 hover:text-blue-800 underline"
        >
          ログイン画面に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">アカウント作成</h2>
        <p className="text-gray-600 mt-2">新しいアカウントを作成してください</p>
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
              アカウント作成中...
            </div>
          ) : (
            'アカウント作成'
          )}
        </Button>
      </form>

      <div className="text-center">
        <div className="text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            こちらからログイン
          </Link>
        </div>
      </div>
    </div>
  );
}