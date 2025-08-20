import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TextPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 呟き投稿用モーダル
 * 詳細な実装は後で追加予定
 */
export function TextPostModal({ isOpen, onClose }: TextPostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>呟きを投稿する</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <p className="text-gray-600">呟き投稿機能は実装予定です。</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}