import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, FileText, MessageSquare } from 'lucide-react';
import { PostOption, FloatingPostButtonProps } from '@/types/floatingPostButton';

/**
 * ホーム画面右下に表示される投稿用フローティングアクションボタン
 * タップするとメニューが展開され、投稿種類を選択できる
 */
export function FloatingPostButton({ onCreateProblemPost, onCreateTextPost }: FloatingPostButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const postOptions: PostOption[] = [
    {
      id: 'problem',
      label: '漢字問題を投稿する',
      icon: FileText,
      onClick: () => {
        onCreateProblemPost();
        setIsMenuOpen(false);
      }
    },
    {
      id: 'text',
      label: '呟きを投稿する',
      icon: MessageSquare,
      onClick: () => {
        onCreateTextPost();
        setIsMenuOpen(false);
      }
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* メニューオプション */}
      <div className={`absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-0 min-w-48 z-50">
          {postOptions.map((option, index) => {
            const Icon = option.icon;
            const isFirst = index === 0;
            const isLast = index === postOptions.length - 1;
            return (
              <div
                key={option.id}
                onClick={option.onClick}
                className={`cursor-pointer py-3 hover:bg-gray-50 ${!isLast ? 'border-b border-gray-200' : ''
                  } ${isFirst ? 'rounded-t-lg' : ''
                  } ${isLast ? 'rounded-b-lg' : ''
                  }`}
              >
                <div className="flex items-center gap-2 px-4 text-sm text-gray-700">
                  <Icon className="w-4 h-4 text-gray-500" />
                  {option.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* メインボタン */}
      <Button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen
          ? 'bg-gray-600 hover:bg-gray-700'
          : 'bg-blue-600 hover:bg-blue-700'
          }`}
        size="sm"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* 背景オーバーレイ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}