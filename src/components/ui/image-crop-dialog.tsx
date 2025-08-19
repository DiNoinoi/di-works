import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getPrimaryButtonClasses } from '@/constants/colors';
import { IMAGE_CONSTRAINTS } from '@/constants/imageUpload';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

/**
 * 画像切り取りダイアログコンポーネント
 * 400x400の正方形に画像を切り取り、円形プレビューで表示範囲を確認できる
 */
export function ImageCropDialog({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropDialogProps) {
  // 切り取り位置の座標
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // ズーム倍率
  const [zoom, setZoom] = useState(1);
  // 実際の切り取り範囲（ピクセル単位）
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // 画像処理中の状態
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 切り取り範囲が変更された時の処理
   * react-easy-cropから呼ばれるコールバック関数
   * @param croppedAreaPixels 絶対座標（ピクセル値）- Canvas描画に使用
   */
  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * 切り取った画像をBlobとして生成（サイズ制限内に圧縮）
   * Canvasを使用して400x400の正方形画像を作成し、必要に応じて圧縮
   */
  const createCroppedImage = async (): Promise<Blob> => {
    if (!croppedAreaPixels) {
      throw new Error('切り取り範囲が設定されていません');
    }

    return new Promise((resolve, reject) => {
      // 画像処理用のCanvasを作成
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context を取得できませんでした'));
        return;
      }

      // 元画像をImageオブジェクトとして読み込み
      const image = new Image();
      image.onload = async () => {
        // 設定されたサイズの正方形キャンバスを設定
        canvas.width = IMAGE_CONSTRAINTS.CROP_SIZE;
        canvas.height = IMAGE_CONSTRAINTS.CROP_SIZE;

        // 指定された切り取り範囲の画像をキャンバスに描画
        // drawImage(画像, 切り取り開始x, 切り取り開始y, 切り取り幅, 切り取り高さ, 描画先x, 描画先y, 描画幅, 描画高さ)
        ctx.drawImage(
          image,
          croppedAreaPixels.x,    // 元画像での切り取り開始X座標
          croppedAreaPixels.y,    // 元画像での切り取り開始Y座標
          croppedAreaPixels.width,  // 元画像での切り取り幅
          croppedAreaPixels.height, // 元画像での切り取り高さ
          0,                      // キャンバス上の描画開始X座標
          0,                      // キャンバス上の描画開始Y座標
          IMAGE_CONSTRAINTS.CROP_SIZE, // キャンバス上の描画幅
          IMAGE_CONSTRAINTS.CROP_SIZE  // キャンバス上の描画高さ
        );

        // 段階的圧縮処理：高品質 → 中品質 → 低品質の順で試行
        const qualityLevels = [
          IMAGE_CONSTRAINTS.JPEG_QUALITY.HIGH,
          IMAGE_CONSTRAINTS.JPEG_QUALITY.MEDIUM,
          IMAGE_CONSTRAINTS.JPEG_QUALITY.LOW
        ];

        for (const quality of qualityLevels) {
          try {
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/jpeg', quality);
            });

            if (!blob) continue;

            // ファイルサイズがしきい値以下なら採用
            if (blob.size <= IMAGE_CONSTRAINTS.MAX_FILE_SIZE) {
              resolve(blob);
              return;
            }
          } catch (error) {
            console.warn(`品質${quality}での圧縮に失敗:`, error);
            continue;
          }
        }

        // 最低品質でもサイズオーバーの場合はエラー
        reject(new Error('画像を指定サイズ以下に圧縮できませんでした'));
      };

      image.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      image.src = imageSrc;
    });
  };

  /**
   * 「適用」ボタンがクリックされた時の処理
   * 画像を切り取ってBlob形式で親コンポーネントに渡す
   */
  const handleApply = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      // 切り取った画像をBlob形式で作成
      const croppedBlob = await createCroppedImage();
      // 親コンポーネントにBlobを渡す
      onCropComplete(croppedBlob);
      // ダイアログを閉じる
      onClose();
    } catch (error) {
      console.error('画像処理エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 「キャンセル」ボタンがクリックされた時の処理
   * すべての状態をリセットしてダイアログを閉じる
   */
  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md w-full bg-white">
        <DialogHeader>
          <DialogTitle>画像を切り取り</DialogTitle>
          <DialogDescription>
            画像をドラッグして位置を調整し、ピンチまたはスクロールでズーム調整してください。
          </DialogDescription>
        </DialogHeader>

        {/* 切り取りエリアのコンテナ */}
        <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}              // 切り取り対象の画像URL
            crop={crop}                   // 現在の切り取り位置
            zoom={zoom}                   // 現在のズーム倍率
            aspect={1}                    // アスペクト比（1:1の正方形）
            cropShape="round"             // 切り取り形状（円形）
            showGrid={false}              // グリッド表示なし
            onCropChange={setCrop}        // 切り取り位置変更時のコールバック
            onZoomChange={setZoom}        // ズーム変更時のコールバック
            onCropComplete={onCropCompleteHandler} // 切り取り完了時のコールバック
          />
        </div>

        {/* ユーザー向けの操作説明 */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          ドラッグで位置調整、ピンチ/スクロールでズーム調整
          <br />
          円形の範囲がプロフィール画像として表示されます
        </p>

        <DialogFooter>
          {/* キャンセルボタン */}
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="border-gray-300"
          >
            キャンセル
          </Button>
          {/* 適用ボタン - 切り取り処理を実行 */}
          <Button
            onClick={handleApply}
            disabled={isProcessing || !croppedAreaPixels}
            className={getPrimaryButtonClasses()}
          >
            {isProcessing ? '処理中...' : '適用'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}