import type { KanjiInfo } from '../types/kanji';
import {
  LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6, LEVEL_8, LEVEL_9, LEVEL_10,
  LEVEL_PRE1, LEVEL_PRE2
} from './kanjiLevels';
import { JIS_LEVEL_1 } from './jisLevels';

/**
 * Unicodeコードポイントベースの漢字データ管理
 * 重複していたKanjiProcessor.tsx、KanjiMasterMode.tsx、WeakKanjiList.tsxのデータを統合
 */
export const KANJI_DATA: Map<number, KanjiInfo> = new Map([
  // 漢字のUnicodeコードポイント: 漢字情報
  [0x6F22, { level: LEVEL_3, reading: 'カン', meaning: '中国・男性' }],        // '漢'
  [0x5B57, { level: LEVEL_6, reading: 'ジ・あざ', meaning: '文字・学問' }],     // '字'
  [0x691C, { level: LEVEL_4, reading: 'ケン', meaning: '調べる・取り調べ' }],   // '検'
  [0x5B9A, { level: LEVEL_4, reading: 'テイ・さだ', meaning: '決める・安定' }], // '定'
  [0x6E96, { level: LEVEL_2, reading: 'ジュン', meaning: '準じる・基準' }],     // '準'
  [0x4E00, { level: LEVEL_10, reading: 'イチ・ひと', meaning: '数の1' }],       // '一'
  [0x7D1A, { level: LEVEL_3, reading: 'キュウ', meaning: '等級・階級' }],       // '級'
  [0x683C, { level: LEVEL_2, reading: 'ゴウ・あ', meaning: '合わせる・適合' }], // '合'
  [0x683C, { level: LEVEL_5, reading: 'カク', meaning: '格式・資格' }],         // '格'
  [0x76EE, { level: LEVEL_9, reading: 'モク・め', meaning: '目・視覚器官' }],   // '目'
  [0x6307, { level: LEVEL_3, reading: 'シ・ゆび', meaning: '指・指示する' }],   // '指'
  [0x52C9, { level: LEVEL_3, reading: 'ベン', meaning: '勉める・努力' }],       // '勉'
  [0x5F37, { level: LEVEL_2, reading: 'キョウ・つよ', meaning: '強い・無理に' }], // '強'
  [0x4E2D, { level: LEVEL_10, reading: 'チュウ・なか', meaning: '中央・途中' }], // '中'
  [0x701F, { level: LEVEL_1, reading: 'ショウ', meaning: 'すっきりした' }],     // '瀟'
  [0x6D12, { level: LEVEL_1, reading: 'シャ', meaning: 'あっさりした' }],       // '洒'
  [0x6182, { level: LEVEL_PRE1, reading: 'ユウ・うれ', meaning: '心配・憂える' }], // '憂'
  [0x4E16, { level: LEVEL_3, reading: 'セ・よ', meaning: '世の中・時代' }],     // '世'
  [0x7F8E, { level: LEVEL_3, reading: 'ビ・うつく', meaning: '美しい・良い' }], // '美'
  [0x611F, { level: LEVEL_3, reading: 'カン', meaning: '感じる・印象' }],       // '感'
  [0x52D5, { level: LEVEL_3, reading: 'ドウ・うご', meaning: '動く・変化' }],   // '動'
  [0x4ECA, { level: LEVEL_2, reading: 'コン・いま', meaning: '現在・今' }],     // '今'
  [0x65E5, { level: LEVEL_9, reading: 'ニチ・ひ', meaning: '太陽・日にち' }],   // '日'
  [0x5B66, { level: LEVEL_8, reading: 'ガク・まな', meaning: '学ぶ・学問' }],   // '学'
  [0x7FD2, { level: LEVEL_3, reading: 'シュウ・なら', meaning: '習う・練習' }], // '習'
  [0x51FA, { level: LEVEL_2, reading: 'シュツ・で', meaning: '出る・外に' }],   // '出'
  [0x4F1A, { level: LEVEL_2, reading: 'カイ・あ', meaning: '会う・集まり' }],   // '会'
  [0x554F, { level: LEVEL_2, reading: 'モン・と', meaning: '問う・質問' }],     // '問'
  [0x984C, { level: LEVEL_3, reading: 'ダイ', meaning: '題目・問題' }],         // '題'
  [0x4F5C, { level: LEVEL_2, reading: 'サク・つく', meaning: '作る・制作' }],   // '作'
  [0x7686, { level: LEVEL_3, reading: 'カイ・みな', meaning: 'みんな・全員' }], // '皆'
  [0x4F55, { level: LEVEL_2, reading: 'カ・なに', meaning: '何・疑問' }],       // '何'
  [0x56DB, { level: LEVEL_8, reading: 'シ・よ', meaning: '数の4' }],           // '四'
  [0x719F, { level: LEVEL_PRE1, reading: 'ジュク', meaning: '熟れる・慣れる' }], // '熟'
  [0x8A9E, { level: LEVEL_2, reading: 'ゴ・かた', meaning: '言葉・語る' }],     // '語'
  [0x610F, { level: LEVEL_3, reading: 'イ', meaning: '心・意味' }],             // '意'
  [0x5473, { level: LEVEL_3, reading: 'ミ・あじ', meaning: '味・風味' }],       // '味'
  [0x671F, { level: LEVEL_3, reading: 'キ・ゴ', meaning: '期間・時期' }],       // '期'
  [0x751F, { level: LEVEL_8, reading: 'セイ・い', meaning: '生きる・人生' }],   // '生'
  [0x6DAF, { level: LEVEL_PRE1, reading: 'ガイ', meaning: '果て・限り' }],     // '涯'
  [0x5EA6, { level: LEVEL_3, reading: 'ド・たび', meaning: '度合い・回数' }],   // '度'
  [0x6A5F, { level: LEVEL_4, reading: 'キ', meaning: '機械・機会' }],           // '機'
  [0x540C, { level: LEVEL_2, reading: 'ドウ・おな', meaning: '同じ・一緒' }],   // '同'
  [0x4E8C, { level: LEVEL_9, reading: 'ニ・ふた', meaning: '数の2' }],         // '二'
  [0x8A2A, { level: LEVEL_PRE1, reading: 'ホウ・おとず', meaning: '訪れる・尋ねる' }], // '訪'
  [0x4F8B, { level: LEVEL_4, reading: 'レイ・たと', meaning: '例・手本' }],     // '例'
  [0x88C5, { level: LEVEL_PRE1, reading: 'ソウ・よそお', meaning: '装う・服装' }], // '装'
  [0x53D7, { level: LEVEL_3, reading: 'ジュ・う', meaning: '受ける・受取る' }], // '受'
  [0x96E8, { level: LEVEL_8, reading: 'ウ・あめ', meaning: '雨・降水' }],       // '雨'
  [0x5C11, { level: LEVEL_2, reading: 'ショウ・すく', meaning: '少ない・わずか' }], // '少'
  [0x6C17, { level: LEVEL_8, reading: 'キ・け', meaning: '気持ち・空気' }],     // '気'
  [0x5206, { level: LEVEL_4, reading: 'ブン・わ', meaning: '分ける・部分' }],   // '分'
  [0x66D6, { level: LEVEL_PRE1, reading: 'アイ', meaning: 'はっきりしない' }],  // '曖'
  [0x6627, { level: LEVEL_PRE1, reading: 'マイ', meaning: 'くらい・愚か' }],    // '昧'
  [0x8AAD, { level: LEVEL_2, reading: 'ドク・よ', meaning: '読む・理解' }],     // '読'
  [0x65B9, { level: LEVEL_2, reading: 'ホウ・かた', meaning: '方向・方法' }],   // '方'
  [0x5F7C, { level: LEVEL_3, reading: 'ヒ・かれ', meaning: '彼・あの人' }],     // '彼'
  [0x660E, { level: LEVEL_2, reading: 'メイ・あか', meaning: '明るい・明白' }], // '明'
  [0x8208, { level: LEVEL_5, reading: 'キョウ・おこ', meaning: '興味・起こす' }], // '興'
  [0x6DF1, { level: LEVEL_3, reading: 'シン・ふか', meaning: '深い・奥深い' }], // '深'
  [0x8A00, { level: LEVEL_2, reading: 'ゲン・い', meaning: '言う・言葉' }],     // '言'
  [0x8449, { level: LEVEL_3, reading: 'ヨウ・は', meaning: '葉・言葉' }],       // '葉'
  [0x95A2, { level: LEVEL_4, reading: 'カン・せき', meaning: '関係・関所' }],   // '関'
  [0x9023, { level: LEVEL_4, reading: 'レン・つら', meaning: '連なる・関連' }], // '連'
  [0x8A73, { level: LEVEL_5, reading: 'ショウ・くわ', meaning: '詳しい・詳細' }], // '詳'
  [0x8ABF, { level: LEVEL_3, reading: 'チョウ・しら', meaning: '調べる・調子' }], // '調'
  [0x6B77, { level: LEVEL_4, reading: 'レキ', meaning: '歴史・経歴' }],         // '歴'
  [0x53F2, { level: LEVEL_4, reading: 'シ', meaning: '歴史・記録' }],           // '史'
  [0x7684, { level: LEVEL_4, reading: 'テキ', meaning: '的・目標' }],           // '的'
  [0x80CC, { level: LEVEL_6, reading: 'ハイ・せ', meaning: '背中・背負う' }],   // '背'
  [0x666F, { level: LEVEL_4, reading: 'ケイ', meaning: '景色・風景' }],         // '景'
  [0x542B, { level: LEVEL_5, reading: 'ガン・ふく', meaning: '含む・含有' }],   // '含'
  [0x66F4, { level: LEVEL_PRE1, reading: 'コウ・さら', meaning: 'さらに・更新' }], // '更'
  [0x5229, { level: LEVEL_4, reading: 'リ', meaning: '利益・便利' }],           // '利'
  [0x4F11, { level: LEVEL_8, reading: 'キュウ・やす', meaning: '休む・休息' }], // '休'
  [0x8336, { level: LEVEL_2, reading: 'チャ・サ', meaning: '茶・お茶' }],       // '茶'
  [0x9053, { level: LEVEL_2, reading: 'ドウ・みち', meaning: '道・方法' }],     // '道'
  [0x7CBE, { level: LEVEL_5, reading: 'セイ・ショウ', meaning: '精神・精密' }], // '精'
  [0x795E, { level: LEVEL_3, reading: 'シン・かみ', meaning: '神・精神' }],     // '神'
  [0x53E4, { level: LEVEL_2, reading: 'コ・ふる', meaning: '古い・昔' }],       // '古'
  [0x5178, { level: LEVEL_4, reading: 'テン', meaning: '典型・古典' }],         // '典'
  [0x611B, { level: LEVEL_4, reading: 'アイ', meaning: '愛・愛する' }],         // '愛'
  [0x597D, { level: LEVEL_4, reading: 'コウ・この', meaning: '好む・良い' }],   // '好'
  [0x8005, { level: LEVEL_3, reading: 'シャ・もの', meaning: '人・者' }],       // '者'
  [0x56DE, { level: LEVEL_2, reading: 'カイ・まわ', meaning: '回る・回数' }],   // '回'
  [0x7B54, { level: LEVEL_2, reading: 'トウ・こた', meaning: '答える・回答' }], // '答'
  [0x7D50, { level: LEVEL_4, reading: 'ケツ・むす', meaning: '結ぶ・結果' }],   // '結'
  [0x679C, { level: LEVEL_4, reading: 'カ・は', meaning: '果物・結果' }],       // '果'
  [0x6B63, { level: LEVEL_8, reading: 'セイ・ただ', meaning: '正しい・正確' }], // '正'
  [0x89E3, { level: LEVEL_5, reading: 'カイ・と', meaning: '解く・理解' }],     // '解'
  [0x4E0D, { level: LEVEL_4, reading: 'フ・ブ', meaning: '不・否定' }],         // '不'
  [0x9593, { level: LEVEL_2, reading: 'カン・あいだ', meaning: '間・時間' }],   // '間'
  [0x9055, { level: LEVEL_PRE2, reading: 'イ・ちが', meaning: '違う・相違' }],   // '違'

  // 配当外漢字（常用漢字だが漢検配当外）
  // JIS第1水準
  [0x6822, { level: JIS_LEVEL_1, reading: 'ハク・ヒャク・ビャク・かしわ', meaning: '柏の異字体・カシワ' }], // '栢'
  [0x7895, { level: JIS_LEVEL_1, reading: 'キ・さい・さき', meaning: '埼の異字体・地名用' }],      // '碕'
  [0x548B, { level: JIS_LEVEL_1, reading: 'サ・サク・く-う・く-らう', meaning: 'くう・くらう' }],        // '咋'
  [0x68EE, { level: JIS_LEVEL_1, reading: 'シン・もり', meaning: '森・森林' }],                // '森'
  [0x5CA9, { level: JIS_LEVEL_1, reading: 'キョウ・みさき', meaning: '岬・突き出た陸地' }],       // '岬'
  [0x65E5, { level: JIS_LEVEL_1, reading: 'ニチ・ジツ・ひ・か', meaning: '日・太陽・日にち' }]      // '日'
]);

/**
 * 文字から漢字情報を取得
 */
export const getKanjiInfo = (char: string): KanjiInfo | undefined => {
  const codePoint = char.codePointAt(0);
  if (!codePoint) return undefined;
  return KANJI_DATA.get(codePoint);
};

/**
 * Unicodeコードポイントから漢字情報を取得
 */
export const getKanjiInfoByCodePoint = (codePoint: number): KanjiInfo | undefined => {
  return KANJI_DATA.get(codePoint);
};