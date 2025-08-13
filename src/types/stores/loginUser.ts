export interface LoginUserState {
  userId: string
  isLoggedIn: () => boolean
  setLoginUser: (userId: string) => void
  resetLoginUser: () => void
}