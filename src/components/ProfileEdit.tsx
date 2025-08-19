import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { getInputClasses, getSelectClasses, getTextareaClasses, getPrimaryButtonClasses, PROFILE_LEVEL_COLORS } from '@/constants/colors';
import { KANJI_KENTEI_LEVEL_NAME, KANJI_KENTEI_LEVEL_ID } from '@/constants/kanjiLevels';
import { GetUserKanjiKenteiLevelsResponse } from '@/types/api/profile/response/GetUserKanjiKenteiLevelsResponse';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { profileService } from '@/services/api/profile';
import { storageService } from '@/services/api/storage';
import { ImageCropDialog } from '@/components/ui/image-crop-dialog';
import { SUPPORTED_IMAGE_TYPES } from '@/constants/imageUpload';
import { GetUserProfileResponse } from '@/types/api/profile/response/GetUserProfileResponse';

interface ProfileEditFormData {
    displayId: string;
    userName: string;
    birthDate: string;
    birthDatePublic: boolean;
    profileText: string;
    avatarUrl: string;
    kanjiKenteiLevel: string;
    passedCount: number;
}

/**
 * プロフィール編集コンポーネント
 */
export function ProfileEdit() {
    const navigate = useNavigate();
    const { userId } = useLoginUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState<GetUserProfileResponse | null>(null);
    const [existingLevels, setExistingLevels] = useState<GetUserKanjiKenteiLevelsResponse[]>([]);
    const [originalLevels, setOriginalLevels] = useState<GetUserKanjiKenteiLevelsResponse[]>([]); // 初期状態を保持
    const [editableLevels, setEditableLevels] = useState<{ [key: string]: number }>({});
    const [activeEditLevel, setActiveEditLevel] = useState<string | null>(null);

    // 画像アップロード関連の状態
    const [isImageCropDialogOpen, setIsImageCropDialogOpen] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');
    const [isImageUploading, setIsImageUploading] = useState(false);

    const [formData, setFormData] = useState<ProfileEditFormData>({
        displayId: '',
        userName: '',
        birthDate: '',
        birthDatePublic: false,
        profileText: '',
        avatarUrl: '',
        kanjiKenteiLevel: '',
        passedCount: 0
    });

    // 漢字検定級の選択肢（DBのlevel_orderに対応）
    const kanjiKenteiOptions = [
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_10,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_10,
            order: 1
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_9,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_9,
            order: 2
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_8,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_8,
            order: 3
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_7,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_7,
            order: 4
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_6,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_6,
            order: 5
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_5,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_5,
            order: 6
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_4,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_4,
            order: 7
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_3,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_3,
            order: 8
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_PRE2,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE2,
            order: 9
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_2,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_2,
            order: 10
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_PRE1,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_PRE1,
            order: 11
        },
        {
            value: KANJI_KENTEI_LEVEL_ID.LEVEL_1,
            label: KANJI_KENTEI_LEVEL_NAME.LEVEL_1,
            order: 12
        }
    ];

    // 既に追加されている級を除外した選択肢
    const availableOptions = kanjiKenteiOptions.filter(option =>
        !existingLevels.some(level => level.kanji_kentei_level_id === option.value)
    );

    // 級をソートする関数（難しい級が上位に表示されるよう降順）
    const sortLevelsByOrder = (levels: GetUserKanjiKenteiLevelsResponse[]) => {
        return [...levels].sort((a, b) => {
            const aOrder = kanjiKenteiOptions.find(opt => opt.value === a.kanji_kentei_level_id)?.order || 0;
            const bOrder = kanjiKenteiOptions.find(opt => opt.value === b.kanji_kentei_level_id)?.order || 0;
            return bOrder - aOrder; // 降順ソート（1級→準1級→2級...の順）
        });
    };

    // プロフィールデータ取得
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) return;

            try {
                setIsLoading(true);
                const [profile, levels] = await Promise.all([
                    profileService.getUserProfile(userId),
                    profileService.getUserKanjiKenteiLevels(userId)
                ]);

                setProfileData(profile);
                setExistingLevels(levels);
                setOriginalLevels(levels); // 初期状態を保存

                // 既存の級データを編集可能な状態に設定
                const levelCounts: { [key: string]: number } = {};
                levels.forEach(level => {
                    levelCounts[level.kanji_kentei_level_id] = level.passed_count;
                });
                setEditableLevels(levelCounts);

                // フォームデータに設定
                setFormData({
                    displayId: profile.display_id,
                    userName: profile.user_name,
                    birthDate: '', // 現在のAPIでは取得できないため空
                    birthDatePublic: false,
                    profileText: profile.profile_text || '',
                    avatarUrl: profile.avatar_url || '', // 既存のアバターURLを設定
                    kanjiKenteiLevel: '',
                    passedCount: 1
                });
            } catch (error) {
                console.error('Profile data fetch error:', error);
                setError('プロフィール情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    // バリデーション関数
    const validateUserName = (value: string): string => {
        if (!value) return '表示名は必須です';
        if (value.length > 50) return '表示名は50文字以内で入力してください';
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

    /**
     * 画像ファイル選択処理
     * ファイルダイアログを開いて画像を選択
     */
    const handleImageSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = SUPPORTED_IMAGE_TYPES.join(',');
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // ファイル形式チェック
            if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
                setError('JPEG、PNG、WebP形式の画像を選択してください');
                return;
            }

            // ファイルを読み込んでプレビュー用のURLを作成
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageSrc = e.target?.result as string;
                setSelectedImageSrc(imageSrc);
                setIsImageCropDialogOpen(true);
                setError(''); // エラーをクリア
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    /**
     * 画像切り取り完了処理
     * 切り取られた画像をSupabaseにアップロードしてプロフィールを更新
     */
    const handleImageCropComplete = async (croppedImageBlob: Blob) => {
        if (!userId) return;

        setIsImageUploading(true);
        try {
            // BlobをFileに変換
            const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' });

            // Supabaseストレージにアップロード
            const avatarUrl = await storageService.uploadAvatar(userId, file);

            // プロフィールのavatar_urlを更新
            await profileService.updateProfile(userId, { avatar_url: avatarUrl });

            // フォームデータを更新
            updateFormData('avatarUrl', avatarUrl);

            setError('');
        } catch (error) {
            console.error('画像アップロードエラー:', error);
            setError('画像のアップロードに失敗しました');
        } finally {
            setIsImageUploading(false);
        }
    };

    // フォーム値の更新
    const updateFormData = (field: keyof ProfileEditFormData, value: string | boolean | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 戻るボタン
    const handleBack = () => {
        navigate('/profile');
    };

    // フォーム送信処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // バリデーション
        const userNameValidation = validateUserName(formData.userName);
        const profileTextValidation = validateProfileText(formData.profileText);
        const passedCountValidation = validatePassedCount(formData.passedCount);

        if (userNameValidation || profileTextValidation || passedCountValidation) {
            setError('入力内容を確認してください');
            setIsLoading(false);
            return;
        }

        try {
            // プロフィール基本情報を更新
            await profileService.updateProfile(userId, {
                user_name: formData.userName,
                profile_text: formData.profileText || undefined
            });

            // 既存の級で変更された合格回数を更新 + 新規追加された級を保存
            for (const [levelId, count] of Object.entries(editableLevels)) {
                const originalLevel = originalLevels.find(level => level.kanji_kentei_level_id === levelId);

                if (count === 0 && originalLevel) {
                    // 0回に設定された既存の級は削除
                    await profileService.deleteUserKanjiKenteiLevel(userId, levelId);
                } else if (count > 0) {
                    // 1回以上の場合はupsert（新規追加 または 既存級で変更があった場合）
                    if (!originalLevel || originalLevel.passed_count !== count) {
                        await profileService.upsertUserKanjiKenteiLevel({
                            user_id: userId,
                            kanji_kentei_level_id: levelId,
                            passed_count: count
                        });
                    }
                }
            }


            // プロフィール更新完了後、プロフィール画面に戻る
            navigate('/profile');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('プロフィールの更新に失敗しました。再度お試しください。');
            }
            console.error('プロフィール更新エラー:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profileData) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">読み込み中...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* ヘッダー */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    戻る
                </Button>
                <h1 className="text-2xl font-bold text-foreground">プロフィール編集</h1>
            </div>

            {/* プロフィール画像編集 */}
            <Card>
                <CardHeader>
                    <CardTitle>プロフィール画像</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={formData.avatarUrl} alt={formData.userName} />
                            <AvatarFallback className="text-2xl">{formData.userName[0]}</AvatarFallback>
                        </Avatar>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleImageSelect}
                            disabled={isImageUploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {isImageUploading ? 'アップロード中...' : '画像を変更'}
                        </Button>
                        <p className="text-sm text-gray-500">
                            JPEG、PNG、WebP形式（編集後のサイズが2MB以下）
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 基本情報編集 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        {/* ユーザーID（読み取り専用） */}
                        <div className="space-y-2">
                            <Label htmlFor="displayId">ユーザーID</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                                <Input
                                    id="displayId"
                                    type="text"
                                    value={formData.displayId}
                                    className={`${getInputClasses()} pl-8 bg-gray-50`}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* 表示名 */}
                        <div className="space-y-2">
                            <Label htmlFor="userName">表示名 *</Label>
                            <Input
                                id="userName"
                                type="text"
                                value={formData.userName}
                                onChange={(e) => updateFormData('userName', e.target.value)}
                                className={getInputClasses()}
                                placeholder="漢字太郎"
                                maxLength={50}
                                disabled={isLoading}
                            />
                            {validateUserName(formData.userName) && (
                                <p className="text-sm text-red-600">{validateUserName(formData.userName)}</p>
                            )}
                        </div>

                        {/* プロフィール文 */}
                        <div className="space-y-2">
                            <Label htmlFor="profileText">プロフィール文</Label>
                            <Textarea
                                id="profileText"
                                value={formData.profileText}
                                onChange={(e) => updateFormData('profileText', e.target.value)}
                                className={getTextareaClasses()}
                                placeholder="自己紹介を入力してください"
                                maxLength={255}
                                disabled={isLoading}
                                rows={4}
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{validateProfileText(formData.profileText) && (
                                    <span className="text-red-600">{validateProfileText(formData.profileText)}</span>
                                )}</span>
                                <span>{formData.profileText.length}/255</span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 漢字検定保持級の管理 */}
            <Card>
                <CardHeader>
                    <CardTitle>漢字検定保持級の管理</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 左右2カラムレイアウト */}
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                            {/* 左側：級追加フォーム（2/7の幅） */}
                            <div className="space-y-3 md:col-span-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kanjiKenteiLevel" className="text-sm">追加する取得級</Label>
                                    <Select
                                        value={formData.kanjiKenteiLevel}
                                        onValueChange={(value) => {
                                            updateFormData('kanjiKenteiLevel', value);
                                            if (value && value !== 'none') {
                                                updateFormData('passedCount', 1);
                                            } else {
                                                updateFormData('passedCount', 0);
                                            }
                                        }}
                                        disabled={isLoading || availableOptions.length === 0}
                                    >
                                        <SelectTrigger className={`${getSelectClasses()} w-32 hover:bg-transparent focus:bg-transparent disabled:cursor-default`}>
                                            <SelectValue placeholder={availableOptions.length === 0 ? "すべて追加済み" : "級を選択"} />
                                        </SelectTrigger>
                                        <SelectContent className="border border-gray-300" position="popper">
                                            {availableOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (formData.kanjiKenteiLevel) {
                                            // 新しい級を追加
                                            const selectedOption = kanjiKenteiOptions.find(opt => opt.value === formData.kanjiKenteiLevel);
                                            if (selectedOption) {
                                                const newLevel = {
                                                    kanji_kentei_level_id: formData.kanjiKenteiLevel,
                                                    kanji_kentei_level_name: selectedOption.label,
                                                    passed_count: 1,
                                                    level_order: selectedOption.order
                                                };
                                                // 新しい級を追加してソート
                                                const updatedLevels = sortLevelsByOrder([...existingLevels, newLevel]);
                                                setExistingLevels(updatedLevels);
                                                setEditableLevels(prev => ({
                                                    ...prev,
                                                    [formData.kanjiKenteiLevel]: 1
                                                }));
                                                // フォームをリセット
                                                updateFormData('kanjiKenteiLevel', '');
                                            }
                                        }
                                    }}
                                    disabled={isLoading || !formData.kanjiKenteiLevel || availableOptions.length === 0}
                                    className="border-gray-300 w-32 disabled:cursor-default"
                                >
                                    追加
                                </Button>
                            </div>

                            {/* 右側：取得済み級バッジ（5/7の幅） */}
                            <div className="space-y-2 md:col-span-5">
                                <Label className="text-sm">実績</Label>
                                {existingLevels.length > 0 ? (
                                    existingLevels.map((level) => (
                                        <div
                                            key={level.kanji_kentei_level_id}
                                            className={`${PROFILE_LEVEL_COLORS[level.kanji_kentei_level_id]} text-white text-sm px-4 py-2 inline-flex items-center gap-2 mr-3 mb-2 rounded-lg h-10 cursor-default`}
                                            onClick={() => setActiveEditLevel(activeEditLevel === level.kanji_kentei_level_id ? null : level.kanji_kentei_level_id)}
                                        >
                                            <span className="font-semibold translate-y-px">{level.kanji_kentei_level_name}</span>
                                            <span className="text-sm opacity-90 translate-y-px">
                                                {editableLevels[level.kanji_kentei_level_id] ?? level.passed_count}回合格
                                            </span>

                                            {/* 矢印ボタン */}
                                            <div className="inline-flex flex-col ml-2 h-8 justify-center">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0 text-white hover:bg-white/20 flex items-center justify-center shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const currentCount = editableLevels[level.kanji_kentei_level_id] ?? level.passed_count;
                                                        setEditableLevels(prev => ({
                                                            ...prev,
                                                            [level.kanji_kentei_level_id]: Math.min(999, currentCount + 1)
                                                        }));
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0 text-white hover:bg-white/20 flex items-center justify-center shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const currentCount = editableLevels[level.kanji_kentei_level_id] ?? level.passed_count;
                                                        setEditableLevels(prev => ({
                                                            ...prev,
                                                            [level.kanji_kentei_level_id]: Math.max(0, currentCount - 1)
                                                        }));
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">まだ合格級がありません</p>
                                )}
                            </div>
                        </div>

                        {/* エラーメッセージ */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* ボタン */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                className={`flex items-center gap-2 ${getPrimaryButtonClasses()}`}
                                disabled={isLoading}
                            >
                                <Save className="w-4 h-4" />
                                {isLoading ? '更新中...' : '保存する'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={isLoading}
                                className="border-gray-300"
                            >
                                キャンセル
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 画像切り取りダイアログ */}
            <ImageCropDialog
                isOpen={isImageCropDialogOpen}
                onClose={() => setIsImageCropDialogOpen(false)}
                imageSrc={selectedImageSrc}
                onCropComplete={handleImageCropComplete}
            />
        </div>
    );
}