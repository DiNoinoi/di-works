import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { HomePage } from './pages/Home';
import { Profile } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { PostCreate } from './pages/PostCreate';
import { Dictionary } from './pages/Dictionary';
import { WeakKanji } from './pages/WeakKanji';
import { KankenMaster } from './pages/KankenMaster';
import { PostDetailPage } from './pages/PostDetail';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { ResetPasswordPage } from './pages/ResetPassword';
import { NewPasswordPage } from './pages/NewPassword';
import { supabase } from './lib/supabase';
import { Search, Bell } from 'lucide-react';

/**
 * メインアプリケーションコンポーネント
 * React Routerによるルーティング設定
 */
function App() {
  // Supabase認証状態変更の監視
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('ログイン成功:', session.user);
        // 必要に応じてリダイレクト処理
      } else if (event === 'SIGNED_OUT') {
        console.log('ログアウト完了');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 通常ページ（AppLayout使用） */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="posts/create" element={<PostCreate />} />
          <Route path="posts/:id" element={<PostDetailPage />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="weak-kanji" element={<WeakKanji />} />
          <Route path="kanken-master" element={<KankenMaster />} />
          
          {/* 検索ページ */}
          <Route path="search" element={
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">検索機能</h2>
              <p className="text-gray-600">漢字、ユーザー、クイズを検索できます</p>
            </div>
          } />
          
          {/* 通知ページ */}
          <Route path="notifications" element={
            <div className="text-center py-20">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">通知</h2>
              <p className="text-gray-600">新しい通知はありません</p>
            </div>
          } />
        </Route>

        {/* 認証ページ（AuthLayout使用） */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;