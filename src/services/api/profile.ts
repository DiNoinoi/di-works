import { supabase } from '@/lib/supabase';
import { CreateProfileRequest } from '@/types/api/profile/request/CreateProfileRequest';
import { UpdateProfileRequest } from '@/types/api/profile/request/UpdateProfileRequest';
import { CheckDisplayIdResponse } from '@/types/api/profile/response/CheckDisplayIdResponse';
import { GetUserProfileResponse } from '@/types/api/profile/response/GetUserProfileResponse';
import { GetUserKanjiKenteiLevelsResponse } from '@/types/api/profile/response/GetUserKanjiKenteiLevelsResponse';
import { GetUserBadgesResponse } from '@/types/api/profile/response/GetUserBadgesResponse';
import { UpsertUserKanjiKenteiLevelRequest } from '@/types/api/profile/request/UpsertUserKanjiKenteiLevelRequest';

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
  async getUserProfile(userId: string): Promise<GetUserProfileResponse> {
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
          following_count,
          title:title_master(
            title_id,
            name,
            description
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      // 配列から単一オブジェクトに変換
      const result: GetUserProfileResponse = {
        ...data,
        title: data.title && data.title.length > 0 ? data.title[0] : null
      };

      return result;
    } catch (error) {
      console.error('User profile fetch error:', error);
      throw new Error('プロフィール情報の取得に失敗しました');
    }
  },

  /**
   * ユーザーの検定級別合格数取得
   */
  async getUserKanjiKenteiLevels(userId: string): Promise<GetUserKanjiKenteiLevelsResponse[]> {
    try {
      const { data, error } = await supabase
        .from('user_kanji_kentei_level_count')
        .select(`
          kanji_kentei_level_id,
          passed_count,
          kanji_kentei_level_master(
            kanji_kentei_level_name,
            level_order
          )
        `)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // データ変換とソート
      const result: GetUserKanjiKenteiLevelsResponse[] = (data?.map((level: any) => ({
        kanji_kentei_level_id: level.kanji_kentei_level_id,
        kanji_kentei_level_name: level.kanji_kentei_level_master.kanji_kentei_level_name,
        level_order: level.kanji_kentei_level_master.level_order,
        passed_count: level.passed_count
      })) || [])
      // level_order降順でソート（高い級が先に）
      .sort((a, b) => b.level_order - a.level_order);

      return result;
    } catch (error) {
      console.error('User kanji kentei levels fetch error:', error);
      throw new Error('検定級別合格数の取得に失敗しました');
    }
  },

  /**
   * ユーザーの獲得バッジ取得
   */
  async getUserBadges(userId: string): Promise<GetUserBadgesResponse[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          earned_at,
          badge_master(
            name,
            description,
            icon_url
          )
        `)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // データ変換
      const result: GetUserBadgesResponse[] = (data?.map((badge: any) => ({
        badge_id: badge.badge_id,
        name: badge.badge_master.name,
        description: badge.badge_master.description,
        icon_url: badge.badge_master.icon_url,
        earned_at: badge.earned_at
      })) || []);

      return result;
    } catch (error) {
      console.error('User badges fetch error:', error);
      throw new Error('獲得バッジの取得に失敗しました');
    }
  },

  /**
   * ユーザーの漢字検定級別合格回数をupsert（新規作成/更新）
   */
  async upsertUserKanjiKenteiLevel(requestData: UpsertUserKanjiKenteiLevelRequest): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_kanji_kentei_level_count')
        .upsert(requestData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Upsert user kanji kentei level error:', error);
      throw new Error('漢字検定級の合格回数の保存に失敗しました');
    }
  }
} as const;