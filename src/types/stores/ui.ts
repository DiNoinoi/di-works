/**
 * UI表示状態管理ストア型定義
 */
export interface UIState {
  /** 漢字マスターモード表示枠の可視性 */
  masterModeVisible: boolean;
  /** 漢字マスターモードのON/OFF状態 */
  masterMode: boolean;
  /** 漢字マスターモード表示枠の可視性を取得 */
  isMasterModeVisible: () => boolean;
  /** 漢字マスターモードの状態を取得 */
  isMasterModeEnabled: () => boolean;
  /** 漢字マスターモード表示枠の可視性を切り替え */
  toggleMasterModeVisible: () => void;
  /** 漢字マスターモードのON/OFF切り替え */
  toggleMasterMode: () => void;
}