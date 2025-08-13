import { useState } from 'react';
import type { MasterModeSettings, UnassignedJISLevel } from '@/types/settings';
import { FILTER_MODES } from '@/constants/filterModes';
import { LEVEL_PRE1 } from '@/constants/kanjiLevels';
import { DEFAULT_JIS_LEVEL } from '@/constants/jisLevels';

/**
 * ユーザー設定管理のカスタムフック
 * App.tsx の設定状態管理を一元化
 */
export const useUserSettings = () => {
  // 漢字マスターモードの有効/無効
  const [masterModeEnabled, setMasterModeEnabled] = useState(false);
  
  // 漢字マスターモードの詳細設定
  const [masterModeSettings, setMasterModeSettings] = useState<MasterModeSettings>({
    userLevel: LEVEL_PRE1,                        // 準1級
    filterMode: FILTER_MODES.AT_OR_BELOW,        // 保持級以下を表示
    showUnassigned: false,                       // 配当外漢字は初期非表示
    unassignedJisLevel: DEFAULT_JIS_LEVEL        // JIS第4水準まで（全表示）
  });

  /**
   * マスターモードの有効/無効を切り替え
   */
  const toggleMasterMode = () => {
    setMasterModeEnabled(prev => !prev);
  };

  /**
   * マスターモード設定を更新
   */
  const updateMasterModeSettings = (newSettings: MasterModeSettings) => {
    setMasterModeSettings(newSettings);
  };

  /**
   * 個別設定項目を更新
   */
  const updateUserLevel = (level: string) => {
    setMasterModeSettings(prev => ({ ...prev, userLevel: level }));
  };

  const updateFilterMode = (filterMode: typeof FILTER_MODES[keyof typeof FILTER_MODES]) => {
    setMasterModeSettings(prev => ({ ...prev, filterMode }));
  };

  const updateShowUnassigned = (showUnassigned: boolean) => {
    setMasterModeSettings(prev => ({ ...prev, showUnassigned }));
  };

  const updateUnassignedJisLevel = (unassignedJisLevel: UnassignedJISLevel) => {
    setMasterModeSettings(prev => ({ ...prev, unassignedJisLevel }));
  };

  return {
    // 状態
    masterModeEnabled,
    masterModeSettings,
    
    // アクション
    toggleMasterMode,
    updateMasterModeSettings,
    updateUserLevel,
    updateFilterMode,
    updateShowUnassigned,
    updateUnassignedJisLevel
  };
};