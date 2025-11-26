# タイピングゲーム

ビジネス用語をマスターしよう！日本語のビジネス用語をローマ字でタイピングして、スコアを競うWebアプリケーションです。

## URL

https://typing-game-business.vercel.app/

## スクリーンショット

| ホーム画面 | プレイ画面 |
|:---:|:---:|
| ![ホーム画面](docs/01_home.png) | ![プレイ画面](docs/02_play.png) |

| 結果画面 | ランキング |
|:---:|:---:|
| ![結果画面](docs/03_result.png) | ![ランキング](docs/04_ranking.png) |

## 機能

- ビジネス用語のタイピング練習
- スコア・正確率・タイピング速度の計測
- コンボシステム（連続正解でボーナス）
- 単語ごとの制限時間
- オンラインランキング機能（TOP 10）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | Next.js 15, React 19, TypeScript, Tailwind CSS |
| データベース | Supabase |
| ホスティング | Vercel |

## システム構成

![アーキテクチャ図](docs/00_architecture.png)

## ローカル開発

```bash
npm install
npm run dev
```
