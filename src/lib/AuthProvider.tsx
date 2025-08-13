import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLoginUserStore } from '@/stores/loginUserStore';

/**
 * Supabase認証状態の変化を監視
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setLoginUser, resetLoginUser } = useLoginUserStore();

  useEffect(() => {
    // 認証状態変化の監視
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setLoginUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        resetLoginUser();
      }
    });

    const subscription = authListener.data.subscription;

    // コンポーネント破棄時にSupabase監視を停止
    return () => {
      subscription.unsubscribe();
    };
  }, [setLoginUser, resetLoginUser]);

  // 子コンポーネントをそのまま表示
  return <>{children}</>;
}