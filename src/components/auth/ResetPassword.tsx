import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api/auth';
import { getInputClasses, getPrimaryButtonClasses } from '@/constants/colors';

/**
 * パスワードリセットコンポーネント
 * メールアドレスを入力してリセットメールを送信
 */
export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Supabaseのパスワードリセット機能を使用
      await authService.resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setError('パスワードリセットメールの送信に失敗しました。メールアドレスを確認してください。');
      console.error('パスワードリセットエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">リセットメールを送信しました</h2>
          <p className="text-blue-700 mb-4">
            {email} にパスワードリセット用のメールを送信しました。
          </p>
          <p className="text-sm text-blue-600">
            メール内のリンクをクリックして新しいパスワードを設定してください。
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
        <h2 className="text-3xl font-bold">パスワードリセット</h2>
        <p className="text-gray-600 mt-2">メールアドレスを入力してください</p>
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
              送信中...
            </div>
          ) : (
            'リセットメールを送信'
          )}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link
          to="/auth/login"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          ログイン画面に戻る
        </Link>

        <div className="text-sm text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link
            to="/auth/signup"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            こちらから作成
          </Link>
        </div>
      </div>
    </div>
  );
}