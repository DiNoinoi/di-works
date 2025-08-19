/**
 * 画像アップロード関連の定数
 */

// サポートする画像ファイル形式
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp'
] as const;

export type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

// ファイルサイズ制限
export const IMAGE_CONSTRAINTS = {
  // 最大ファイルサイズ（バイト単位）
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  // 切り取り後の画像サイズ
  CROP_SIZE: 400,
  // JPEG圧縮品質（0.1 - 1.0）
  JPEG_QUALITY: {
    HIGH: 0.9,    // 高品質
    MEDIUM: 0.7,  // 中品質  
    LOW: 0.5      // 低品質（圧縮優先）
  }
} as const;