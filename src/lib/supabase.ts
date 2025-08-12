import { createClient } from '@supabase/supabase-js'

// Supabase設定（環境変数から取得）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabaseクライアントインスタンス
 * アプリ全体で共有するSupabase接続設定
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,        // 自動トークン更新
    persistSession: true,          // ログイン状態保持
    detectSessionInUrl: true       // URL内認証パラメータ検出
  }
})