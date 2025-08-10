/**
 * 漢字マスターモードのフィルタ定数
 */
export const FILTER_MODES = {
  ABOVE: 'above',           // 保持級以上を表示
  AT_OR_BELOW: 'at_or_below', // 保持級以下を表示  
  ALL: 'all'                // すべて表示
} as const;