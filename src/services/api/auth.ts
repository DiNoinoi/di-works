import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * 認証API処理
 */
export const authService = {
  /**
   * メールアドレスでサインアップ
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  /**
   * メールアドレスでサインイン
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  /**
   * サインアウト
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },

  /**
   * 現在のユーザー情報取得
   */
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser()
    return data.user
  },

  /**
   * パスワードリセットメール送信
   */
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/new-password`
    })

    if (error) throw error
  },

  /**
   * パスワード更新
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
  }
} as const