import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProblemPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 漢字問題投稿用モーダル
 * 詳細な実装は後で追加予定
 */
export function ProblemPostModal({ isOpen, onClose }: ProblemPostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>漢字問題を投稿する</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <p className="text-gray-600">漢字問題投稿機能は実装予定です。</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}