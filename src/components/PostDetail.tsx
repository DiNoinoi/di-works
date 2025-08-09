import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Heart, MessageCircle, Share, Quote, Send, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

interface Post {
  id: number;
  author: string;
  username: string;
  timestamp: string;
  content: string;
  type: 'normal' | 'quiz';
  quiz?: {
    question: string;
    answer: string;
    type: string;
    difficulty: number;
    rating: number;
  };
  likes: number;
  shares: number;
  comments: Comment[];
  isLiked: boolean;
}

const mockPost: Post = {
  id: 1,
  author: '漢字花子',
  username: '@kanji_hanako',
  timestamp: '2024年3月15日 14:30',
  content: '今日の四字熟語クイズ！漢字の美しさを感じられる問題を作ってみ��した。皆さんはいかがでしょうか？',
  type: 'quiz',
  quiz: {
    question: '「一期一会」の意味は？',
    answer: '生涯に一度だけの機会。同じ機会は二度と訪れないことの例え。',
    type: '意味',
    difficulty: 3,
    rating: 4
  },
  likes: 47,
  shares: 12,
  comments: [
    {
      id: 1,
      author: '文字太郎',
      username: '@moji_taro',
      content: '素晴らしい問題ですね！一期一会は茶道の精神からきている言葉で、とても深い意味がありますね。',
      timestamp: '2時間前',
      likes: 8,
      replies: [
        {
          id: 2,
          author: '漢字花子',
          username: '@kanji_hanako',
          content: 'ありがとうございます！茶道との関連についても詳しく調べてみたいと思います。',
          timestamp: '1時間前',
          likes: 3,
          replies: []
        }
      ]
    },
    {
      id: 3,
      author: '古典愛好者',
      username: '@koten_lover',
      content: 'この四字熟語は利休の言葉から生まれたとされていますね。歴史的背景も含めて学ぶと更に興味深いです。',
      timestamp: '1時間前',
      likes: 12,
      replies: []
    }
  ],
  isLiked: false
};

export function PostDetail({ postId }: { postId: number }) {
  const [post, setPost] = useState<Post>(mockPost);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: 'あなた',
      username: '@current_user',
      content: newComment.trim(),
      timestamp: 'たった今',
      likes: 0,
      replies: []
    };

    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
    setNewComment('');
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now(),
      author: 'あなた',
      username: '@current_user',
      content: replyContent.trim(),
      timestamp: 'たった今',
      likes: 0,
      replies: []
    };

    setPost(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    }));
    setReplyContent('');
    setReplyingTo(null);
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-sm">{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-gray-500 text-xs">{comment.username}</span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-400 text-xs">{comment.timestamp}</span>
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="w-3 h-3" />
              {comment.likes > 0 && comment.likes}
            </button>
            {!isReply && (
              <button 
                className="hover:text-blue-500 transition-colors"
                onClick={() => setReplyingTo(comment.id)}
              >
                返信
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 返信フォーム */}
      {replyingTo === comment.id && (
        <div className="ml-12 space-y-2">
          <Textarea
            placeholder={`${comment.author}さんに返信...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleAddReply(comment.id)}>
              <Send className="w-3 h-3 mr-1" />
              返信
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
              キャンセル
            </Button>
          </div>
        </div>
      )}
      
      {/* 返信一覧 */}
      {comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          {/* 投稿ヘッダー */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-lg">{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author}</span>
                <span className="text-gray-500 text-sm">{post.username}</span>
              </div>
              <div className="text-gray-400 text-sm">{post.timestamp}</div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* 投稿内容 */}
          <div className="mb-4">
            <p className="mb-3">{post.content}</p>
            
            {post.type === 'quiz' && post.quiz && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {post.quiz.type}クイズ
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    難易度 {post.quiz.difficulty}/5
                  </Badge>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < post.quiz!.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="font-medium text-blue-900 mb-2">{post.quiz.question}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-700 hover:text-blue-800">
                    答えを見る
                  </summary>
                  <p className="mt-2 p-2 bg-white rounded border">{post.quiz.answer}</p>
                </details>
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-6">
              <button 
                className={`flex items-center gap-1 text-sm transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments.length}
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-500 transition-colors">
                <Share className="w-4 h-4" />
                {post.shares}
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-500 transition-colors">
                <Quote className="w-4 h-4" />
                引用
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* コメント一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">コメント ({post.comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 新規コメント作成 */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">あ</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="コメントを書く..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="w-3 h-3 mr-1" />
                    投稿
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* コメント一覧 */}
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
            
            {post.comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>まだコメントがありません。最初のコメントを書いてみましょう！</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}