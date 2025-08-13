import { FILTER_MODES } from '@/constants/filterModes';
import { JIS_LEVELS } from '@/constants/jisLevels';

/**
 * 漢字マスターモードのフィルタ種別
 */
export type FilterMode = typeof FILTER_MODES[keyof typeof FILTER_MODES];

/**
 * 配当外漢字のJIS水準種別
 */
export type UnassignedJISLevel = typeof JIS_LEVELS[number];

/**
 * 漢字マスターモードの設定
 */
export interface MasterModeSettings {
  userLevel: string;                      // 漢検保持級
  filterMode: FilterMode;                 // 漢検フィルタモード
  showUnassigned: boolean;                // 配当外漢字表示
  unassignedJisLevel: UnassignedJISLevel; // 配当外漢字のJIS第何水準まで表示
}

/**
 * ユーザー設定の全体
 */
export interface UserSettings {
  masterModeEnabled: boolean;
  masterModeSettings: MasterModeSettings;
}