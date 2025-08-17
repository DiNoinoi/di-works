/**
 * 称号ID定数
 */
export const TITLE_ID = {
  TITLE_0001: 'title_0001',
  TITLE_0002: 'title_0002',
  TITLE_0003: 'title_0003',
  TITLE_0004: 'title_0004',
  TITLE_0005: 'title_0005',
  TITLE_0006: 'title_0006',
  TITLE_0007: 'title_0007',
  TITLE_0008: 'title_0008',
  TITLE_0009: 'title_0009',
  TITLE_0010: 'title_0010',
  TITLE_0011: 'title_0011',
  TITLE_0012: 'title_0012',
  TITLE_0013: 'title_0013',
  TITLE_0014: 'title_0014',
  TITLE_0015: 'title_0015',
  TITLE_0016: 'title_0016',
  TITLE_0017: 'title_0017',
  TITLE_0018: 'title_0018',
  TITLE_0019: 'title_0019',
  TITLE_0020: 'title_0020',
  TITLE_0021: 'title_0021',
  TITLE_0022: 'title_0022',
  TITLE_0023: 'title_0023',
  TITLE_0024: 'title_0024',
  TITLE_0025: 'title_0025',
  TITLE_0026: 'title_0026',
  TITLE_0027: 'title_0027',
  TITLE_0028: 'title_0028',
  TITLE_0029: 'title_0029',
  TITLE_0030: 'title_0030',
} as const;

/** タイトルIDの型 */
export type TitleId = typeof TITLE_ID[keyof typeof TITLE_ID];