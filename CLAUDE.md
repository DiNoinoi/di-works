# 漢字SNSプロジェクト - Claude Code用設定

## プロジェクト概要
漢字学習とSNS機能を組み合わせたReactアプリケーションです。漢字検定の級別表示機能や投稿作成・閲覧機能を提供します。

## 技術スタック
- **フレームワーク**: React 18.3.1 (TypeScript)
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **UIライブラリ**: Radix UI
- **アイコン**: Lucide React

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 型チェック + ビルド
npm run build

# リンター実行
npm run lint

# プレビュー
npm run preview
```

## プロジェクト構造
```
src/
├── App.tsx                      # メインアプリケーション
├── main.tsx                     # エントリーポイント
├── index.css                    # グローバルスタイル
└── components/
    ├── KanjiMasterMode.tsx      # 漢検マスターモード設定
    ├── KanjiProcessor.tsx       # 漢字処理・表示コンポーネント
    ├── PostCreation.tsx         # 投稿作成
    ├── PostDetail.tsx           # 投稿詳細
    ├── Settings.tsx             # 設定画面
    ├── UserDictionary.tsx       # ユーザー辞書
    ├── UserProfile.tsx          # プロフィール
    ├── WeakKanjiList.tsx        # 苦手漢字リスト
    ├── figma/
    │   └── ImageWithFallback.tsx
    └── ui/                      # UIコンポーネント（shadcn/ui）
        ├── button.tsx
        ├── card.tsx
        ├── badge.tsx
        └── ... (その他多数)
```

## 主要機能
1. **漢検マスターモード**: 投稿内の漢字を配当級別に色分け表示
2. **投稿システム**: テキスト投稿とクイズ投稿
3. **ユーザープロフィール**: 個人設定とプロフィール管理
4. **辞書機能**: 漢字検索・学習支援
5. **苦手漢字管理**: 学習進捗の追跡

## コーディング規約
- TypeScriptの厳密な型定義を使用
- Tailwind CSSのクラスベーススタイリング
- Radix UIベースのコンポーネント設計
- 関数型コンポーネントとReact Hooks使用
- 日本語のコメントとUI表示

## 注意事項
- 漢字処理関連の機能は日本語特化
- レスポンシブデザイン対応（モバイル・タブレット・デスクトップ）
- アクセシビリティを考慮したUI設計