import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginUserState } from '@/types/stores/loginUser'

/**
 * 認証状態管理ストア
 */
export const useLoginUserStore = create<LoginUserState>()(
  persist(
    (set, get) => ({
      /** ログイン中のユーザーID */
      userId: '',
      /** ログイン済みであるかを判定 */
      isLoggedIn: () => get().userId !== '',
      /** ユーザーIDをローカルストレージに保存 */
      setLoginUser: (userId: string) => {
        try {
          set({ userId })
        } catch (error) {
          console.error('ログインの保存に失敗しました:', error)
          set({ userId: '' })
          throw new Error('ログインの保存に失敗しました。再度お試しください。')
        }
      },
      /** ユーザーIDをローカルストレージからリセット */
      resetLoginUser: () => {
        set({ userId: '' })
      },
    }),
    {
      name: 'authState',
      // ローカルストレージにはuserIdのみを保存（isLoggedIn関数は除外）
      partialize: (state) => ({ userId: state.userId }),
    }
  )
)