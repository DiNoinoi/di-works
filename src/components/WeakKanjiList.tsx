import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, TrendingDown, Target, BookOpen, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { getLevelColor, getSelectClasses } from '@/constants/colors';

interface WeakKanji {
  id: number;
  character: string;
  reading: string;
  meaning: string;
  level: string;
  mistakeCount: number;
  totalAttempts: number;
  lastMistake: string;
  category: string;
  relatedQuizzes: {
    type: string;
    difficulty: number;
    dateAttempted: string;
    result: 'correct' | 'incorrect';
  }[];
  studyStatus: 'not-started' | 'studying' | 'mastered';
}

const mockWeakKanji: WeakKanji[] = [
  {
    id: 1,
    character: '瀟',
    reading: 'ショウ',
    meaning: 'すっきりした',
    level: '1級',
    mistakeCount: 8,
    totalAttempts: 12,
    lastMistake: '2024年3月15日',
    category: '読み',
    studyStatus: 'studying',
    relatedQuizzes: [
      { type: '読み', difficulty: 5, dateAttempted: '2024年3月15日', result: 'incorrect' },
      { type: '意味', difficulty: 4, dateAttempted: '2024年3月10日', result: 'correct' },
      { type: '読み', difficulty: 5, dateAttempted: '2024年3月8日', result: 'incorrect' }
    ]
  },
  {
    id: 2,
    character: '憂',
    reading: 'ユウ・うれ',
    meaning: '心配する',
    level: '準1級',
    mistakeCount: 5,
    totalAttempts: 8,
    lastMistake: '2024年3月12日',
    category: '書き取り',
    studyStatus: 'studying',
    relatedQuizzes: [
      { type: '書き取り', difficulty: 4, dateAttempted: '2024年3月12日', result: 'incorrect' },
      { type: '読み', difficulty: 3, dateAttempted: '2024年3月5日', result: 'correct' }
    ]
  },
  {
    id: 3,
    character: '曖',
    reading: 'アイ',
    meaning: 'はっきりしない',
    level: '準1級',
    mistakeCount: 3,
    totalAttempts: 10,
    lastMistake: '2024年3月8日',
    category: '意味',
    studyStatus: 'not-started',
    relatedQuizzes: [
      { type: '意味', difficulty: 3, dateAttempted: '2024年3月8日', result: 'incorrect' },
      { type: '読み', difficulty: 3, dateAttempted: '2024年3月3日', result: 'correct' }
    ]
  },
  {
    id: 4,
    character: '洒',
    reading: 'シャ',
    meaning: 'あっさりした',
    level: '1級',
    mistakeCount: 6,
    totalAttempts: 9,
    lastMistake: '2024年3月14日',
    category: '読み',
    studyStatus: 'studying',
    relatedQuizzes: [
      { type: '読み', difficulty: 5, dateAttempted: '2024年3月14日', result: 'incorrect' }
    ]
  }
];

export function WeakKanjiList() {
  const [weakKanji, setWeakKanji] = useState<WeakKanji[]>(mockWeakKanji);
  const [sortBy, setSortBy] = useState('mistake-rate');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');


  const statusColors = {
    'not-started': 'bg-gray-100 text-gray-800',
    'studying': 'bg-blue-100 text-blue-800',
    'mastered': 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    'not-started': '未着手',
    'studying': '学習中',
    'mastered': '習得済み'
  };

  const categories = ['all', '読み', '意味', '書き取り', '対義語', '類義語'];

  const filteredKanji = weakKanji
    .filter(kanji => filterCategory === 'all' || kanji.category === filterCategory)
    .filter(kanji => filterStatus === 'all' || kanji.studyStatus === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'mistake-rate':
          return (b.mistakeCount / b.totalAttempts) - (a.mistakeCount / a.totalAttempts);
        case 'mistake-count':
          return b.mistakeCount - a.mistakeCount;
        case 'recent':
          return new Date(b.lastMistake).getTime() - new Date(a.lastMistake).getTime();
        case 'level':
          return a.level.localeCompare(b.level);
        default:
          return 0;
      }
    });

  const updateStudyStatus = (id: number, status: WeakKanji['studyStatus']) => {
    setWeakKanji(prev => prev.map(kanji => 
      kanji.id === id ? { ...kanji, studyStatus: status } : kanji
    ));
  };

  const overallStats = {
    totalWeak: weakKanji.length,
    studying: weakKanji.filter(k => k.studyStatus === 'studying').length,
    mastered: weakKanji.filter(k => k.studyStatus === 'mastered').length,
    averageMistakeRate: Math.round(
      weakKanji.reduce((sum, k) => sum + (k.mistakeCount / k.totalAttempts), 0) / weakKanji.length * 100
    )
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              苦手漢字リスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">漢字一覧</TabsTrigger>
                <TabsTrigger value="stats">統計・分析</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{overallStats.totalWeak}</div>
                    <div className="text-sm text-gray-600">苦手漢字総数</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{overallStats.studying}</div>
                    <div className="text-sm text-gray-600">学習中</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{overallStats.mastered}</div>
                    <div className="text-sm text-gray-600">習得済み</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{overallStats.averageMistakeRate}%</div>
                    <div className="text-sm text-gray-600">平均誤答率</div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">学習進捗</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>習得率</span>
                          <span>{Math.round((overallStats.mastered / overallStats.totalWeak) * 100)}%</span>
                        </div>
                        <Progress value={(overallStats.mastered / overallStats.totalWeak) * 100} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-600">未着手</div>
                          <div className="text-lg">{overallStats.totalWeak - overallStats.studying - overallStats.mastered}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">学習中</div>
                          <div className="text-lg">{overallStats.studying}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">習得済み</div>
                          <div className="text-lg">{overallStats.mastered}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list" className="space-y-4">
                {/* フィルタ・ソート */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">並び順</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className={getSelectClasses()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistake-rate">誤答率順</SelectItem>
                        <SelectItem value="mistake-count">間違い回数順</SelectItem>
                        <SelectItem value="recent">最近の間違い順</SelectItem>
                        <SelectItem value="level">配当級順</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">カテゴリ</label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className={getSelectClasses()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">学習状況</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className={getSelectClasses()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="not-started">未着手</SelectItem>
                        <SelectItem value="studying">学習中</SelectItem>
                        <SelectItem value="mastered">習得済み</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 漢字一覧 */}
                <div className="space-y-4">
                  {filteredKanji.map((kanji) => {
                    const mistakeRate = Math.round((kanji.mistakeCount / kanji.totalAttempts) * 100);
                    
                    return (
                      <Card key={kanji.id} className="border-l-4 border-l-red-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl font-bold text-center">
                                {kanji.character}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={getLevelColor(kanji.level)}>
                                    {kanji.level}
                                  </Badge>
                                  <Badge variant="outline">
                                    {kanji.category}
                                  </Badge>
                                  <Badge className={statusColors[kanji.studyStatus]}>
                                    {statusLabels[kanji.studyStatus]}
                                  </Badge>
                                </div>
                                <div>
                                  <div className="font-semibold">読み: {kanji.reading}</div>
                                  <div className="text-gray-600">意味: {kanji.meaning}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right space-y-2">
                              <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-500" />
                                <span className="text-lg font-bold text-red-600">{mistakeRate}%</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {kanji.mistakeCount}/{kanji.totalAttempts} 間違い
                              </div>
                              <div className="text-xs text-gray-500">
                                最終: {kanji.lastMistake}
                              </div>
                            </div>
                          </div>
                          
                          {/* 関連クイズ履歴 */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">最近のクイズ履歴</h4>
                            <div className="flex gap-2 flex-wrap">
                              {kanji.relatedQuizzes.slice(0, 3).map((quiz, index) => (
                                <Tooltip key={index}>
                                  <TooltipTrigger asChild>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                      quiz.result === 'correct' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {quiz.result === 'correct' ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <XCircle className="w-3 h-3" />
                                      )}
                                      {quiz.type}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{quiz.type}クイズ (難易度{quiz.difficulty})</p>
                                    <p>{quiz.dateAttempted}</p>
                                    <p>結果: {quiz.result === 'correct' ? '正解' : '不正解'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                          
                          {/* アクションボタン */}
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStudyStatus(kanji.id, 'studying')}
                              disabled={kanji.studyStatus === 'studying'}
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              学習開始
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStudyStatus(kanji.id, 'mastered')}
                              disabled={kanji.studyStatus === 'mastered'}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              習得済み
                            </Button>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              復習クイズ
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {filteredKanji.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>条件に一致する苦手漢字がありません。</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}