import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getInputClasses, getSelectClasses, getTextareaClasses, getPrimaryButtonClasses } from '@/constants/colors';
import { KANJI_KENTEI_LEVEL_NAME, KANJI_KENTEI_LEVEL_ID } from '@/constants/kanjiLevels';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { ProfileFormData } from '@/types/profile';
import { profileService } from '@/services/api/profile';
import { APP_NAME } from '@/constants/app';
import { TITLE_ID } from '@/constants/titles';

/**
 * プロフィール作成コンポーネント
 */
export function ProfileSetup() {
  const navigate = useNavigate();
  const { userId } = useLoginUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayIdError, setDisplayIdError] = useState('');
  const [isCheckingDisplayId, setIsCheckingDisplayId] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    displayId: '',
    userName: '',
    birthDate: '',
    birthDatePublic: false,
    profileText: '',
    avatarUrl: '',
    kanjiKenteiLevel: '',
    passedCount: 1
  });

  // 漢字検定級の選択肢
  const kanjiKenteiOptions = [
    {
      value: 'none',
      label: '持っていない'
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_10,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_10
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_9,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_9
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_8,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_8
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_7,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_7
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_6,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_6
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_5,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_5
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_4,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_4
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_3,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_3
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_PRE2,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE2
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_2,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_2
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_PRE1,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE1
    },
    {
      value: KANJI_KENTEI_LEVEL_ID.LEVEL_1,
      label: KANJI_KENTEI_LEVEL_NAME.LEVEL_1
    }
  ];

  // バリデーション関数
  const validateDisplayId = (value: string): string => {
    if (!value) return 'ユーザーIDは必須です';
    if (value.length > 50) return 'ユーザーIDは50文字以内で入力してください';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return '英数字とアンダーバーのみ使用できます';
    return '';
  };

  const validateUsername = (value: string): string => {
    if (!value) return '表示名は必須です';
    if (value.length > 50) return '表示名は50文字以内で入力してください';
    return '';
  };

  const validateBirthDate = (value: string): string => {
    if (!value) return '';
    const today = new Date();
    const birthDate = new Date(value);
    if (birthDate >= today) return '生年月日は現在よりも過去の日付を入力してください';
    return '';
  };

  const validateProfileText = (value: string): string => {
    if (value.length > 255) return 'プロフィール文は255文字以内で入力してください';
    return '';
  };

  const validatePassedCount = (value: number): string => {
    if (value > 999) return '合格回数は999回以下で入力してください';
    return '';
  };

  // 表示用IDの重複チェック（デバウンス処理付き）
  const checkDisplayIdAvailability = async (displayId: string) => {
    if (!displayId || validateDisplayId(displayId)) return;

    setIsCheckingDisplayId(true);
    try {
      const response = await profileService.checkDisplayId(displayId);
      if (!response.isAvailable) {
        setDisplayIdError(response.message || 'このユーザーIDは既に使用されています');
      } else {
        setDisplayIdError('');
      }
    } catch (error) {
      setDisplayIdError('ユーザーIDの確認中にエラーが発生しました');
    } finally {
      setIsCheckingDisplayId(false);
    }
  };

  // フォーム値の更新
  const updateFormData = (field: keyof ProfileFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 表示用IDの場合は重複チェック
    if (field === 'displayId' && typeof value === 'string') {
      const validationError = validateDisplayId(value);
      setDisplayIdError(validationError);

      if (!validationError && value !== formData.displayId) {
        // デバウンス処理
        setTimeout(() => checkDisplayIdAvailability(value), 500);
      }
    }
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // バリデーション
    const displayIdValidation = validateDisplayId(formData.displayId);
    const usernameValidation = validateUsername(formData.userName);
    const birthDateValidation = validateBirthDate(formData.birthDate);
    const profileTextValidation = validateProfileText(formData.profileText);
    const passedCountValidation = validatePassedCount(formData.passedCount);

    if (displayIdValidation || usernameValidation || birthDateValidation || profileTextValidation || passedCountValidation || displayIdError) {
      setError('入力内容を確認してください');
      setIsLoading(false);
      return;
    }

    try {
      // プロフィール基本情報を作成
      await profileService.createProfile({
        user_id: userId,
        display_id: formData.displayId,
        user_name: formData.userName,
        birth_date: formData.birthDate || undefined,
        birth_date_public: formData.birthDatePublic,
        profile_text: formData.profileText || undefined,
        avatar_url: formData.avatarUrl || undefined,
        kanji_kentei_level: (formData.kanjiKenteiLevel && formData.kanjiKenteiLevel !== 'none') ? formData.kanjiKenteiLevel : undefined,
        title_id: TITLE_ID.TITLE_0001
      });

      // 級が選択されていて合格回数が1以上の場合、合格回数も保存
      if (formData.kanjiKenteiLevel && formData.kanjiKenteiLevel !== 'none' && formData.passedCount > 0) {
        await profileService.upsertUserKanjiKenteiLevel({
          user_id: userId,
          kanji_kentei_level_id: formData.kanjiKenteiLevel,
          passed_count: formData.passedCount
        });
      }

      // プロフィール作成完了後、ホーム画面に遷移
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('プロフィールの作成に失敗しました。再度お試しください。');
      }
      console.error('プロフィール作成エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
        <p className="text-gray-600">プロフィールを入力してください</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ユーザーID */}
          <div className="space-y-2">
            <Label htmlFor="displayId">ユーザーID *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
              <Input
                id="displayId"
                type="text"
                value={formData.displayId}
                onChange={(e) => updateFormData('displayId', e.target.value)}
                className={`${getInputClasses()} pl-8`}
                placeholder="username"
                maxLength={50}
                disabled={isLoading}
              />
            </div>
            {isCheckingDisplayId && (
              <p className="text-sm text-blue-600">確認中...</p>
            )}
            {displayIdError && (
              <p className="text-sm text-red-600">{displayIdError}</p>
            )}
            {!displayIdError && formData.displayId && !isCheckingDisplayId && (
              <p className="text-sm text-green-600">このユーザーIDは使用可能です</p>
            )}
          </div>

          {/* 表示名 */}
          <div className="space-y-2">
            <Label htmlFor="username">表示名 *</Label>
            <Input
              id="username"
              type="text"
              value={formData.userName}
              onChange={(e) => {
                updateFormData('userName', e.target.value);
                setUsernameTouched(true);
              }}
              className={getInputClasses()}
              placeholder="漢字太郎"
              maxLength={50}
              disabled={isLoading}
            />
            {usernameTouched && validateUsername(formData.userName) && (
              <p className="text-sm text-red-600">{validateUsername(formData.userName)}</p>
            )}
          </div>

          {/* 生年月日 */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">生年月日（任意）</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => updateFormData('birthDate', e.target.value)}
              className={getInputClasses()}
              disabled={isLoading}
            />
            {validateBirthDate(formData.birthDate) && (
              <p className="text-sm text-red-600">{validateBirthDate(formData.birthDate)}</p>
            )}
          </div>

          {/* 生年月日の公開可否 */}
          {formData.birthDate && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="birthDatePublic"
                checked={formData.birthDatePublic}
                onCheckedChange={(checked) => updateFormData('birthDatePublic', checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="birthDatePublic" className="text-sm">
                生年月日の公開を許可する
              </Label>
            </div>
          )}

          {/* プロフィール文 */}
          <div className="space-y-2">
            <Label htmlFor="profileText">プロフィール文（任意）</Label>
            <Textarea
              id="profileText"
              value={formData.profileText}
              onChange={(e) => updateFormData('profileText', e.target.value)}
              className={getTextareaClasses()}
              placeholder="自己紹介を入力してください"
              maxLength={255}
              disabled={isLoading}
              rows={3}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{validateProfileText(formData.profileText) && (
                <span className="text-red-600">{validateProfileText(formData.profileText)}</span>
              )}</span>
              <span>{formData.profileText.length}/255</span>
            </div>
          </div>

          {/* 漢字検定の保持級 */}
          <div className="space-y-2">
            <Label htmlFor="kanjiKenteiLevel">漢字検定の保持級（任意）</Label>
            <Select
              value={formData.kanjiKenteiLevel}
              onValueChange={(value) => {
                updateFormData('kanjiKenteiLevel', value);
                // 実際の級が選択されたら合格回数を1回にリセット
                if (value && value !== 'none') {
                  updateFormData('passedCount', 1);
                } else {
                  updateFormData('passedCount', 0);
                }
              }}
              disabled={isLoading}
              dir="ltr"
            >
              <SelectTrigger className={`${getSelectClasses()} hover:bg-transparent focus:bg-transparent`}>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="border border-gray-300" position="popper">
                {kanjiKenteiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              級を設定するにはベタ問テストが必要です（後で設定可能）
            </p>
          </div>

          {/* 合格回数 */}
          <div className="space-y-2">
            <Label htmlFor="passedCount">選択した級の合格回数</Label>
            <div className="flex items-center gap-1">
              <Input
                id="passedCount"
                type="number"
                value={formData.kanjiKenteiLevel && formData.kanjiKenteiLevel !== 'none' ? formData.passedCount : 0}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;
                  updateFormData('passedCount', count);
                  // 0回を選択したら級を未選択状態に戻す
                  if (count === 0) {
                    updateFormData('kanjiKenteiLevel', '');
                  }
                }}
                className={`${getInputClasses()} w-20 ${!formData.kanjiKenteiLevel || formData.kanjiKenteiLevel === 'none' ? 'text-gray-400' : ''}`}
                min={0}
                max={999}
                disabled={isLoading || !formData.kanjiKenteiLevel || formData.kanjiKenteiLevel === 'none'}
              />
              <span className={formData.kanjiKenteiLevel && formData.kanjiKenteiLevel !== 'none' ? "text-gray-700" : "text-gray-400"}>回</span>
            </div>
            {formData.kanjiKenteiLevel && validatePassedCount(formData.passedCount) && (
              <p className="text-sm text-red-600">{validatePassedCount(formData.passedCount)}</p>
            )}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <Button
            type="submit"
            className={`w-full ${getPrimaryButtonClasses()}`}
            disabled={isLoading || isCheckingDisplayId || !!displayIdError}
          >
            {isLoading ? 'プロフィールを作成中...' : 'プロフィールを作成'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}