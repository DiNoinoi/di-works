import { supabase } from '@/lib/supabase';
import { CreateProfileRequest } from '@/types/api/profile/request/CreateProfileRequest';
import { UpdateProfileRequest } from '@/types/api/profile/request/UpdateProfileRequest';
import { CheckDisplayIdResponse } from '@/types/api/profile/response/CheckDisplayIdResponse';
import { UserProfileBasicResponse } from '@/types/api/profile/response/UserProfileBasicResponse';

/**
 * プロフィール関連API処理
 */
export const profileService = {
  /**
   * ユーザーID（display_id）の重複チェック
   */
  async checkDisplayId(displayId: string): Promise<CheckDisplayIdResponse> {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('display_id')
        .eq('display_id', displayId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        throw error;
      }

      return {
        isAvailable: !data, // データが存在しない場合は利用可能
        message: data ? 'このユーザーIDは既に使用されています' : 'このユーザーIDは使用可能です'
      };
    } catch (error) {
      console.error('Display ID check error:', error);
      throw new Error('ユーザーIDの確認中にエラーが発生しました');
    }
  },

  /**
   * プロフィール作成
   */
  async createProfile(profileData: CreateProfileRequest): Promise<void> {
    try {
      // user_infoテーブルにプロフィール情報を挿入
      const { error } = await supabase
        .from('user_info')
        .insert(profileData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      if (error instanceof Error) {
        throw new Error(`プロフィールの作成に失敗しました: ${error.message}`);
      }
      throw new Error('プロフィールの作成に失敗しました');
    }
  },

  /**
   * プロフィール情報取得
   */
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error('プロフィール情報の取得に失敗しました');
    }
  },

  /**
   * プロフィール更新
   */
  async updateProfile(userId: string, profileData: UpdateProfileRequest): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_info')
        .update(profileData)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('プロフィール情報の更新に失敗しました');
    }
  },

  /**
   * プロフィール基本情報取得
   */
  async getProfileBasic(userId: string): Promise<UserProfileBasicResponse> {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select(`
          user_id,
          display_id,
          user_name,
          profile_text,
          created_at,
          answer_count,
          correct_count,
          post_count,
          follower_count,
          following_count
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Profile basic info fetch error:', error);
      throw new Error('プロフィール基本情報の取得に失敗しました');
    }
  }
} as const;