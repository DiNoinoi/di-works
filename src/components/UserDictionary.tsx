import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Plus, Search, Filter, ExternalLink, Quote } from 'lucide-react';
import { getLevelColor } from '@/constants/colors';

interface DictionaryEntry {
  id: number;
  term: string;
  meaning: string;
  source?: string;
  level: string;
  dateAdded: string;
  examples: {
    text: string;
    author: string;
    postId: string;
    date: string;
  }[];
  isRegistered: boolean;
}

const mockEntries: DictionaryEntry[] = [
  {
    id: 1,
    term: '瀟洒',
    meaning: 'あっさりしていて上品なさま。俗っぽくなく、垢抜けしているさま。',
    source: '漢検準1級過去問',
    level: '1級',
    dateAdded: '2024年3月15日',
    isRegistered: true,
    examples: [
      {
        text: '今日漢検準1級の勉強をしていて「瀟洒」という美しい漢字に出会いました。',
        author: '文字太郎',
        postId: 'post_123',
        date: '2024年3月10日'
      },
      {
        text: '彼の瀟洒な装いに感銘を受けました。',
        author: '漢字花子',
        postId: 'post_456',
        date: '2024年3月8日'
      }
    ]
  },
  {
    id: 2,
    term: '憂鬱',
    meaning: '気がふさいで晴れ晴れしないこと。また、そのさま。',
    source: '',
    level: '準1級',
    dateAdded: '2024年2月28日',
    isRegistered: true,
    examples: [
      {
        text: '雨の日は少し憂鬱な気分になります。',
        author: '雨好きユーザー',
        postId: 'post_789',
        date: '2024年2月25日'
      }
    ]
  },
  {
    id: 3,
    term: '曖昧',
    meaning: 'はっきりしないさま。あいまい。',
    source: '漢検2級',
    level: '準1級',
    dateAdded: '2024年1月20日',
    isRegistered: true,
    examples: []
  }
];

export function UserDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>(mockEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterLevel, setFilterLevel] = useState('all');
  
  // 新規追加フォーム
  const [newTerm, setNewTerm] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newSource, setNewSource] = useState('');

  const levels = ['10級', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '準2級', '2級', '準1級', '1級', '配当外'];


  const validateTerm = (term: string): boolean => {
    // 漢字を含むかチェック（簡易版）
    const kanjiRegex = /[\u4e00-\u9faf]/;
    return kanjiRegex.test(term);
  };

  const handleAddEntry = () => {
    if (!newTerm.trim() || !newMeaning.trim()) return;
    if (!validateTerm(newTerm)) {
      alert('漢字を含む語句のみ登録できます。');
      return;
    }

    const newEntry: DictionaryEntry = {
      id: Date.now(),
      term: newTerm.trim(),
      meaning: newMeaning.trim(),
      source: newSource.trim(),
      level: '未分類',
      dateAdded: new Date().toLocaleDateString('ja-JP'),
      isRegistered: true,
      examples: []
    };

    setEntries([newEntry, ...entries]);
    setNewTerm('');
    setNewMeaning('');
    setNewSource('');
  };

  const filteredEntries = entries
    .filter(entry => 
      entry.term.includes(searchTerm) || 
      entry.meaning.includes(searchTerm)
    )
    .filter(entry => 
      filterLevel === 'all' || entry.level === filterLevel
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'term':
          return a.term.localeCompare(b.term);
        case 'level':
          return levels.indexOf(a.level) - levels.indexOf(b.level);
        case 'date':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            ユーザー辞書
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">語句一覧</TabsTrigger>
              <TabsTrigger value="add">語句追加</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-term">語句名 *</Label>
                  <Input
                    id="new-term"
                    placeholder="例: 瀟洒"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                  />
                  <p className="text-xs text-gray-600">※漢字を含む語句のみ登録できます</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-meaning">意味 *</Label>
                  <Textarea
                    id="new-meaning"
                    placeholder="語句の意味を入力してください"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-source">出典（任意）</Label>
                  <Input
                    id="new-source"
                    placeholder="例: 漢検準1級過去問"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleAddEntry}
                  disabled={!newTerm.trim() || !newMeaning.trim() || !validateTerm(newTerm)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  語句を追加
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              {/* 検索・フィルタ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">検索</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="語句や意味で検索"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sort">並び順</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">追加日順</SelectItem>
                      <SelectItem value="term">語句名順</SelectItem>
                      <SelectItem value="level">配当級順</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filter">配当級フィルタ</Label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 語句一覧 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {filteredEntries.length}件の語句が見つかりました
                  </p>
                </div>
                
                {filteredEntries.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold">{entry.term}</h3>
                            <Badge className={getLevelColor(entry.level)}>
                              {entry.level}
                            </Badge>
                            {!entry.isRegistered && (
                              <Badge variant="outline">未登録</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.dateAdded}
                          </div>
                        </div>
                        
                        <div className="text-gray-700">
                          <p>{entry.meaning}</p>
                        </div>
                        
                        {entry.source && (
                          <div className="text-sm text-gray-600">
                            <strong>出典:</strong> {entry.source}
                          </div>
                        )}
                        
                        {entry.examples.length > 0 && (
                          <div className="space-y-2">
                            <Separator />
                            <h4 className="text-sm font-semibold flex items-center gap-1">
                              <Quote className="w-4 h-4" />
                              用例 ({entry.examples.length}件)
                            </h4>
                            <div className="space-y-2">
                              {entry.examples.map((example, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm mb-2">"{example.text}"</p>
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>
                                      投稿者: {example.author} · {example.date}
                                    </span>
                                    <Button size="sm" variant="ghost" className="h-auto p-1">
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredEntries.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>条件に一致する語句が見つかりませんでした。</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}