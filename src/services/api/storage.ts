import { supabase } from '@/lib/supabase';

/**
 * アバター画像関連のストレージサービス
 */
export const storageService = {
  /**
   * アバター画像をアップロードしてURLを取得
   * @param userId ユーザーID
   * @param file アップロードするファイル
   * @returns アップロードされたファイルのパブリックURL
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    // 圧縮後は常にJPEGなのでjpgで固定
    const fileName = `avatar.jpg`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true // 既存ファイルを自動上書き
      });

    if (uploadError) {
      throw new Error(`アップロードに失敗しました: ${uploadError.message}`);
    }

    return this.buildAvatarUrl(userId, fileName);
  },

  /**
   * アバター画像のURLを取得
   * @param userId ユーザーID
   * @returns アバター画像のパブリックURL（存在しない場合はnull）
   */
  async getAvatarUrl(userId: string): Promise<string | null> {
    const { data: files, error } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (error || !files || files.length === 0) {
      return null;
    }

    const avatarFile = files.find(file => file.name.startsWith('avatar.'));
    if (!avatarFile) {
      return null;
    }

    return this.buildAvatarUrl(userId, avatarFile.name);
  },

  /**
   * ファイルパスからパブリックURLを生成
   * @param userId ユーザーID
   * @param fileName ファイル名
   * @returns パブリックURL
   */
  buildAvatarUrl(userId: string, fileName: string): string {
    const filePath = `${userId}/${fileName}`;
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // キャッシュバスト用のタイムスタンプを追加
    const cacheBustUrl = `${publicUrl}?t=${Date.now()}`;
    return cacheBustUrl;
  }
};