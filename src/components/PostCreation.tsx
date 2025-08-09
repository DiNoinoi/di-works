import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Star, Send } from 'lucide-react';

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export function PostCreation() {
  const [activeTab, setActiveTab] = useState('normal');
  const [normalPost, setNormalPost] = useState('');
  
  // 漢字クイズ投稿の状態
  const [quizType, setQuizType] = useState('');
  const [kanjiQuestion, setKanjiQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [qualityRating, setQualityRating] = useState(0);
  const [difficulty, setDifficulty] = useState([3]);
  const [userComment, setUserComment] = useState('');
  const [memo, setMemo] = useState('');
  const [synonym, setSynonym] = useState('');
  const [antonym, setAntonym] = useState('');
  const [source, setSource] = useState('');

  const isNormalPostValid = normalPost.trim().length > 0;
  const isQuizPostValid = quizType && kanjiQuestion.trim() && correctAnswer.trim() && qualityRating > 0;

  const handleSubmit = () => {
    if (activeTab === 'normal' && isNormalPostValid) {
      console.log('普通の投稿:', normalPost);
      setNormalPost('');
    } else if (activeTab === 'quiz' && isQuizPostValid) {
      console.log('クイズ投稿:', {
        quizType,
        kanjiQuestion,
        correctAnswer,
        qualityRating,
        difficulty: difficulty[0],
        userComment,
        memo,
        synonym,
        antonym,
        source
      });
      // リセット
      setQuizType('');
      setKanjiQuestion('');
      setCorrectAnswer('');
      setQualityRating(0);
      setDifficulty([3]);
      setUserComment('');
      setMemo('');
      setSynonym('');
      setAntonym('');
      setSource('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">投稿作成</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="normal">普通の投稿</TabsTrigger>
            <TabsTrigger value="quiz">漢字クイズ投稿</TabsTrigger>
          </TabsList>
          
          <TabsContent value="normal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="normal-post">投稿内容</Label>
              <Textarea
                id="normal-post"
                placeholder="今日学んだ漢字について書いてみましょう..."
                value={normalPost}
                onChange={(e) => setNormalPost(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!isNormalPostValid}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              投稿する
            </Button>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-type">クイズタイプ *</Label>
                <Select value={quizType} onValueChange={setQuizType}>
                  <SelectTrigger>
                    <SelectValue placeholder="クイズタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reading">読み</SelectItem>
                    <SelectItem value="meaning">意味</SelectItem>
                    <SelectItem value="antonym">対義語</SelectItem>
                    <SelectItem value="synonym">類義語</SelectItem>
                    <SelectItem value="kanji-writing">漢字書き取り</SelectItem>
                    <SelectItem value="four-character">四字熟語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">難易度 (現在: {difficulty[0]})</Label>
                <Slider
                  value={difficulty}
                  onValueChange={setDifficulty}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>易しい</span>
                  <span>難しい</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kanji-question">問題文 *</Label>
                <Input
                  id="kanji-question"
                  placeholder="例: 「曖昧」の読みは？"
                  value={kanjiQuestion}
                  onChange={(e) => setKanjiQuestion(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="correct-answer">正解 *</Label>
                <Input
                  id="correct-answer"
                  placeholder="例: あいまい"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>質の評価 *</Label>
              <StarRating rating={qualityRating} onRatingChange={setQualityRating} />
              <p className="text-sm text-gray-600">
                この問題の質を5段階で評価してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-comment">感想・コメント</Label>
                <Textarea
                  id="user-comment"
                  placeholder="この漢字について感じたことや覚え方のコツなど..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memo">メモ</Label>
                <Textarea
                  id="memo"
                  placeholder="個人的なメモや補足情報..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="synonym">類義語</Label>
                <Input
                  id="synonym"
                  placeholder="例: 不明瞭"
                  value={synonym}
                  onChange={(e) => setSynonym(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="antonym">対義語</Label>
                <Input
                  id="antonym"
                  placeholder="例: 明瞭"
                  value={antonym}
                  onChange={(e) => setAntonym(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">出典</Label>
                <Input
                  id="source"
                  placeholder="例: 漢検準1級過去問"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!isQuizPostValid}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              クイズを投稿する
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}