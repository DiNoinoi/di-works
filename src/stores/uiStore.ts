import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIState } from '@/types/stores/ui';

/**
 * UI表示状態管理ストア
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      /** 漢字マスターモード表示枠の可視性 */
      masterModeVisible: true,
      /** 漢字マスターモードのON/OFF状態 */
      masterMode: false,
      /** 漢字マスターモード表示枠の可視性を取得 */
      isMasterModeVisible: () => get().masterModeVisible,
      /** 漢字マスターモードの状態を取得 */
      isMasterModeEnabled: () => get().masterMode,
      /** 漢字マスターモード表示枠の可視性を切り替え */
      toggleMasterModeVisible: () => set((state) => ({ masterModeVisible: !state.masterModeVisible })),
      /** 漢字マスターモードのON/OFF切り替え */
      toggleMasterMode: () => set((state) => ({ masterMode: !state.masterMode })),
    }),
    {
      name: 'uiStore',
      partialize: (state) => ({ 
        masterModeVisible: state.masterModeVisible,
        masterMode: state.masterMode 
      }),
    }
  )
);