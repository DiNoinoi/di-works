import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

// 漢字データの例
const kanjiData: { [key: string]: { level: string; reading: string; meaning: string; } } = {
  '漢': { level: '3級', reading: 'カン', meaning: '中国・男性' },
  '字': { level: '6級', reading: 'ジ・あざ', meaning: '文字・学問' },
  '検': { level: '4級', reading: 'ケン', meaning: '調べる・取り調べ' },
  '定': { level: '4級', reading: 'テイ・さだ', meaning: '決める・安定' },
  '準': { level: '2級', reading: 'ジュン', meaning: '準じる・基準' },
  '一': { level: '10級', reading: 'イチ・ひと', meaning: '数の1' },
  '級': { level: '3級', reading: 'キュウ', meaning: '等級・階級' },
  '合': { level: '2級', reading: 'ゴウ・あ', meaning: '合わせる・適合' },
  '格': { level: '5級', reading: 'カク', meaning: '格式・資格' },
  '目': { level: '9級', reading: 'モク・め', meaning: '目・視覚器官' },
  '指': { level: '3級', reading: 'シ・ゆび', meaning: '指・指示する' },
  '勉': { level: '3級', reading: 'ベン', meaning: '勉める・努力' },
  '強': { level: '2級', reading: 'キョウ・つよ', meaning: '強い・無理に' },
  '中': { level: '10級', reading: 'チュウ・なか', meaning: '中央・途中' },
  '瀟': { level: '1級', reading: 'ショウ', meaning: 'すっきりした' },
  '洒': { level: '1級', reading: 'シャ', meaning: 'あっさりした' },
  '憂': { level: '準1級', reading: 'ユウ・うれ', meaning: '心配・憂える' },
  '世': { level: '3級', reading: 'セ・よ', meaning: '世の中・時代' },
  '美': { level: '3級', reading: 'ビ・うつく', meaning: '美しい・良い' },
  '感': { level: '3級', reading: 'カン', meaning: '感じる・印象' },
  '動': { level: '3級', reading: 'ドウ・うご', meaning: '動く・変化' },
  '今': { level: '2級', reading: 'コン・いま', meaning: '現在・今' },
  '日': { level: '9級', reading: 'ニチ・ひ', meaning: '太陽・日にち' },
  '学': { level: '8級', reading: 'ガク・まな', meaning: '学ぶ・学問' },
  '習': { level: '3級', reading: 'シュウ・なら', meaning: '習う・練習' },
  '出': { level: '2級', reading: 'シュツ・で', meaning: '出る・外に' },
  '会': { level: '2級', reading: 'カイ・あ', meaning: '会う・集まり' },
  '問': { level: '2級', reading: 'モン・と', meaning: '問う・質問' },
  '題': { level: '3級', reading: 'ダイ', meaning: '題目・問題' },
  '作': { level: '2級', reading: 'サク・つく', meaning: '作る・制作' },
  '皆': { level: '3級', reading: 'カイ・みな', meaning: 'みんな・全員' },
  '何': { level: '2級', reading: 'カ・なに', meaning: '何・疑問' },
  '四': { level: '8級', reading: 'シ・よ', meaning: '数の4' },
  '熟': { level: '準1級', reading: 'ジュク', meaning: '熟れる・慣れる' },
  '語': { level: '2級', reading: 'ゴ・かた', meaning: '言葉・語る' },
  '意': { level: '3級', reading: 'イ', meaning: '心・意味' },
  '味': { level: '3級', reading: 'ミ・あじ', meaning: '味・風味' },
  '期': { level: '3級', reading: 'キ・ゴ', meaning: '期間・時期' },
  '生': { level: '8級', reading: 'セイ・い', meaning: '生きる・人生' },
  '涯': { level: '準1級', reading: 'ガイ', meaning: '果て・限り' },
  '度': { level: '3級', reading: 'ド・たび', meaning: '度合い・回数' },
  '機': { level: '4級', reading: 'キ', meaning: '機械・機会' },
  '同': { level: '2級', reading: 'ドウ・おな', meaning: '同じ・一緒' },
  '二': { level: '9級', reading: 'ニ・ふた', meaning: '数の2' },
  '訪': { level: '準1級', reading: 'ホウ・おとず', meaning: '訪れる・尋ねる' },
  '例': { level: '4級', reading: 'レイ・たと', meaning: '例・手本' },
  '装': { level: '準1級', reading: 'ソウ・よそお', meaning: '装う・服装' },
  '受': { level: '3級', reading: 'ジュ・う', meaning: '受ける・受取る' },
  '雨': { level: '8級', reading: 'ウ・あめ', meaning: '雨・降水' },
  '少': { level: '2級', reading: 'ショウ・すく', meaning: '少ない・わずか' },
  '気': { level: '8級', reading: 'キ・け', meaning: '気持ち・空気' },
  '分': { level: '4級', reading: 'ブン・わ', meaning: '分ける・部分' },
  '曖': { level: '準1級', reading: 'アイ', meaning: 'はっきりしない' },
  '昧': { level: '準1級', reading: 'マイ', meaning: 'くらい・愚か' },
  '読': { level: '2級', reading: 'ドク・よ', meaning: '読む・理解' },
  '方': { level: '2級', reading: 'ホウ・かた', meaning: '方向・方法' },
  '彼': { level: '3級', reading: 'ヒ・かれ', meaning: '彼・あの人' },
  '明': { level: '2級', reading: 'メイ・あか', meaning: '明るい・明白' },
  '興': { level: '5級', reading: 'キョウ・おこ', meaning: '興味・起こす' },
  '深': { level: '3級', reading: 'シン・ふか', meaning: '深い・奥深い' },
  '言': { level: '2級', reading: 'ゲン・い', meaning: '言う・言葉' },
  '葉': { level: '3級', reading: 'ヨウ・は', meaning: '葉・言葉' },
  '関': { level: '4級', reading: 'カン・せき', meaning: '関係・関所' },
  '連': { level: '4級', reading: 'レン・つら', meaning: '連なる・関連' },
  '詳': { level: '5級', reading: 'ショウ・くわ', meaning: '詳しい・詳細' },
  '調': { level: '3級', reading: 'チョウ・しら', meaning: '調べる・調子' },
  '歴': { level: '4級', reading: 'レキ', meaning: '歴史・経歴' },
  '史': { level: '4級', reading: 'シ', meaning: '歴史・記録' },
  '的': { level: '4級', reading: 'テキ', meaning: '的・目標' },
  '背': { level: '6級', reading: 'ハイ・せ', meaning: '背中・背負う' },
  '景': { level: '4級', reading: 'ケイ', meaning: '景色・風景' },
  '含': { level: '5級', reading: 'ガン・ふく', meaning: '含む・含有' },
  '更': { level: '準1級', reading: 'コウ・さら', meaning: 'さらに・更新' },
  '利': { level: '4級', reading: 'リ', meaning: '利益・便利' },
  '休': { level: '8級', reading: 'キュウ・やす', meaning: '休む・休息' },
  '茶': { level: '2級', reading: 'チャ・サ', meaning: '茶・お茶' },
  '道': { level: '2級', reading: 'ドウ・みち', meaning: '道・方法' },
  '精': { level: '5級', reading: 'セイ・ショウ', meaning: '精神・精密' },
  '神': { level: '3級', reading: 'シン・かみ', meaning: '神・精神' },
  '古': { level: '2級', reading: 'コ・ふる', meaning: '古い・昔' },
  '典': { level: '4級', reading: 'テン', meaning: '典型・古典' },
  '愛': { level: '4級', reading: 'アイ', meaning: '愛・愛する' },
  '好': { level: '4級', reading: 'コウ・この', meaning: '好む・良い' },
  '者': { level: '3級', reading: 'シャ・もの', meaning: '人・者' },
  '回': { level: '2級', reading: 'カイ・まわ', meaning: '回る・回数' },
  '答': { level: '2級', reading: 'トウ・こた', meaning: '答える・回答' },
  '結': { level: '4級', reading: 'ケツ・むす', meaning: '結ぶ・結果' },
  '果': { level: '4級', reading: 'カ・は', meaning: '果物・結果' },
  '正': { level: '8級', reading: 'セイ・ただ', meaning: '正しい・正確' },
  '解': { level: '5級', reading: 'カイ・と', meaning: '解く・理解' },
  '不': { level: '4級', reading: 'フ・ブ', meaning: '不・否定' },
  '間': { level: '2級', reading: 'カン・あいだ', meaning: '間・時間' },
  '違': { level: '準2級', reading: 'イ・ちが', meaning: '違う・相違' }
};

const levelColors: { [key: string]: string } = {
  '10級': 'bg-green-100 text-green-800',
  '9級': 'bg-green-200 text-green-800',
  '8級': 'bg-blue-100 text-blue-800',
  '7級': 'bg-blue-200 text-blue-800',
  '6級': 'bg-cyan-100 text-cyan-800',
  '5級': 'bg-purple-100 text-purple-800',
  '4級': 'bg-indigo-100 text-indigo-800',
  '3級': 'bg-yellow-100 text-yellow-800',
  '2級': 'bg-orange-100 text-orange-800',
  '準2級': 'bg-orange-200 text-orange-800',
  '準1級': 'bg-red-100 text-red-800',
  '1級': 'bg-red-200 text-red-800',
  '配当外': 'bg-gray-100 text-gray-800'
};

interface KanjiCharProps {
  char: string;
  data?: { level: string; reading: string; meaning: string; };
  isHighlighted: boolean;
}

const KanjiChar: React.FC<KanjiCharProps> = ({ char, data, isHighlighted }) => {
  if (!data || !isHighlighted) {
    return <span>{char}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`px-1 rounded ${levelColors[data.level]} cursor-pointer transition-all hover:shadow-sm`}>
          {char}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{char}</span>
            <Badge variant="outline" className="text-xs">
              {data.level}
            </Badge>
          </div>
          <div className="text-sm">
            <div><strong>読み:</strong> {data.reading}</div>
            <div><strong>意味:</strong> {data.meaning}</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface KanjiProcessorProps {
  text: string;
  userLevel?: string;
  filterMode?: 'above' | 'at_or_below' | 'all';
  showMode?: boolean;
  compoundMode?: boolean;
  className?: string;
}

export function KanjiProcessor({ 
  text, 
  userLevel = '準1級', 
  filterMode = 'all', 
  showMode = true,
  compoundMode = false,
  className = ''
}: KanjiProcessorProps) {
  const levelHierarchy = ['10級', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '準2級', '2級', '準1級', '1級'];
  const userLevelIndex = levelHierarchy.indexOf(userLevel);

  const shouldHighlight = (kanjiLevel: string): boolean => {
    if (!showMode) return false;
    if (filterMode === 'all') return true;
    
    const kanjiLevelIndex = levelHierarchy.indexOf(kanjiLevel);
    if (kanjiLevelIndex === -1) return filterMode === 'all'; // 配当外
    
    if (filterMode === 'above') {
      return kanjiLevelIndex <= userLevelIndex;
    } else if (filterMode === 'at_or_below') {
      return kanjiLevelIndex >= userLevelIndex;
    } else {
      return true;
    }
  };

  const processText = (text: string) => {
    return text.split('').map((char, index) => {
      const data = kanjiData[char];
      const isHighlighted = data ? shouldHighlight(data.level) : false;
      
      return (
        <KanjiChar
          key={index}
          char={char}
          data={data}
          isHighlighted={isHighlighted}
        />
      );
    });
  };

  return (
    <TooltipProvider>
      <span className={className}>
        {processText(text)}
      </span>
    </TooltipProvider>
  );
}