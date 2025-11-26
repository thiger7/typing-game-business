# 開発ガイド

## 必要な環境

- Node.js 18+
- npm または pnpm

## 環境設定

`.env.local` ファイルを作成し、以下の環境変数を設定:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### 3. ビルド

```bash
npm run build
```

### 4. 本番サーバー起動

```bash
npm run start
```

## Supabase セットアップ

### テーブル作成

Supabase で `rankings` テーブルを作成:

```sql
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(5) NOT NULL,
  score INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  typingSpeed INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/ranking` | ランキング取得（上位10件） |
| POST | `/api/ranking` | ランキング登録 |

### POST リクエストボディ

```json
{
  "nickname": "ユーザー名",
  "score": 2500,
  "accuracy": 95,
  "typingSpeed": 200
}
```

## プロジェクト構成

```
src/app/
├── api/
│   └── ranking/          # ランキングAPI
├── components/
│   ├── Header.tsx        # ヘッダー
│   ├── GameSettings.tsx  # ゲーム設定画面
│   ├── GamePlay.tsx      # ゲームプレイ画面
│   ├── GameResult.tsx    # 結果画面
│   └── Ranking.tsx       # ランキング画面
├── hooks/
│   └── useTypingGame.ts  # ゲームロジック
├── services/
│   ├── supabaseClient.ts # Supabaseクライアント
│   └── rankingService.ts # ランキングサービス
├── data/
│   └── words.ts          # 単語データ
└── types/
    └── index.d.ts        # 型定義
```

## 依存関係

### 本番

- next
- react
- react-dom
- @supabase/supabase-js

### 開発

- typescript
- tailwindcss
- eslint
- prettier

## デプロイ

Vercel へのデプロイ:

1. Vercel にプロジェクトをインポート
2. 環境変数を設定
3. デプロイ実行

```bash
vercel --prod
```
