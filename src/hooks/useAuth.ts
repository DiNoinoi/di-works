import { useState, useEffect } from 'react';
import type { User, AuthStatus, LoginCredentials } from '../types/user';

/**
 * 認証関連のカスタムフック
 * 将来的にはAPI経由でユーザー情報を取得・管理
 * 現在は開発用の仮データを返す
 */
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  // 開発用仮ユーザーデータ
  const mockUser: User = {
    id: '1',
    name: '漢字太郎',
    username: '@kanji_taro',
    email: 'kanji.taro@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  // コンポーネントマウント時に認証状態をチェック
  useEffect(() => {
    // TODO: 実際のAPI実装時には以下のような処理に置き換える
    // const checkAuthStatus = async () => {
    //   try {
    //     const response = await api.getCurrentUser();
    //     setUser(response.data);
    //     setStatus('authenticated');
    //   } catch (error) {
    //     setStatus('unauthenticated');
    //   }
    // };
    
    // 開発用: 1秒後に認証済み状態にする
    const timer = setTimeout(() => {
      setUser(mockUser);
      setStatus('authenticated');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * ログイン処理
   * @param credentials ログイン認証情報
   */
  const login = async (_credentials: LoginCredentials): Promise<void> => {
    setStatus('loading');
    
    // TODO: 実際のAPI実装時には以下のような処理に置き換える
    // try {
    //   const response = await api.login(credentials);
    //   setUser(response.data.user);
    //   setStatus('authenticated');
    //   // トークンをローカルストレージに保存
    //   localStorage.setItem('authToken', response.data.token);
    // } catch (error) {
    //   setStatus('unauthenticated');
    //   throw new Error('ログインに失敗しました');
    // }
    
    // 開発用: 簡単な認証シミュレーション
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setStatus('authenticated');
  };

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    setStatus('loading');
    
    // TODO: 実際のAPI実装時には以下のような処理に置き換える
    // try {
    //   await api.logout();
    //   localStorage.removeItem('authToken');
    // } catch (error) {
    //   console.error('ログアウトエラー:', error);
    // }
    
    // 開発用: 状態をリセット
    setUser(null);
    setStatus('unauthenticated');
  };

  return {
    status,
    user,
    login,
    logout,
    /** 認証済みかどうかの便利なフラグ */
    isAuthenticated: status === 'authenticated',
    /** ローディング中かどうかの便利なフラグ */
    isLoading: status === 'loading'
  };
}