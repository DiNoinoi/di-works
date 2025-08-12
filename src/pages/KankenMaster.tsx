import { KankenMasterMode } from '../components/KankenMasterMode';

/**
 * 漢検マスターページラッパー
 */
export function KankenMaster() {
  return <KankenMasterMode onSettingsChange={() => { }} currentSettings={{
    userLevel: '2級',
    filterMode: 'all',
    showUnassigned: false,
    unassignedJisLevel: 'JIS4'
  }} />;
}