# aidd.tokyo site

AI駆動開発コミュニティ **aidd.tokyo** のWebサイト。Astro 6 ベースの静的サイトとして構築する。

## 技術スタック

| レイヤ | 採用ツール |
|---|---|
| フレームワーク | [Astro 6](https://astro.build/) (Content Collections + MDX) |
| スタイル | [Tailwind CSS v4](https://tailwindcss.com/) (Vite Plugin) |
| コンテンツ管理 | Markdown / MDX をGit管理 (CMSは使わない) |
| ホスティング | [Cloudflare Pages](https://pages.cloudflare.com/) (GitHub Actions + Wrangler でデプロイ) |
| コメント | [giscus](https://giscus.app/) (GitHub Discussions 連携、後で追加) |
| 検索 | [Pagefind](https://pagefind.app/) (後で追加) |

詳細な選定理由はリポジトリルートの `CLAUDE.md` を参照。

## ディレクトリ構成

```
site/
├── src/
│   ├── content/
│   │   ├── articles/    # 記事・チュートリアル (.mdx)
│   │   └── events/      # イベント情報 (.md)
│   ├── content.config.ts  # Content Collections の Zod スキーマ
│   └── pages/
├── public/              # 静的アセット (favicon等)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 必要な前提

- Node.js `>=22.12.0` (`.tool-versions` で `nodejs 26.2.0` を固定)
- pnpm `11.x` (`.tool-versions` で `pnpm 11.3.0` を固定)

asdf を利用している場合は `asdf install` で必要バージョンが揃う。

## 開発

```bash
# 依存インストール
pnpm install

# 開発サーバ起動 (http://localhost:4321)
pnpm dev

# 型チェック
pnpm check

# 本番ビルド
pnpm build

# ビルド成果物のプレビュー
pnpm preview
```

## コンテンツの追加

### 記事

`src/content/articles/<slug>.mdx` を新規作成する。`<slug>` が公開URLになる。

例:

| ファイル | 公開URL |
|---|---|
| `src/content/articles/ai-driven-development-first-step.mdx` | `/articles/ai-driven-development-first-step/` |

フロントマターは次の形式で記述する。

```mdx
---
title: 記事タイトル
description: 概要 (一覧表示・OGP に使用)
publishedAt: 2026-06-06
tags: [claude-code, tutorial]
author: aidd.tokyo
---

本文をMarkdown / MDX で記述。
```

必要に応じて次の項目も使える。

```mdx
updatedAt: 2026-06-10
draft: true
```

- `draft: true` の記事は公開対象から除外される。
- TOPページの「記事とチュートリアル」には、`draft` ではない記事が `publishedAt` の新しい順に最大3件表示される。
- 記事詳細ページは `/articles/<slug>/` に生成される。
- `tags` は `/tags/` のタグ一覧に表示され、タグ別の記事一覧は `/tags/<tag>/` に生成される。

記事を追加したらローカルで確認する。

```bash
cd site
pnpm dev
```

ブラウザで `http://localhost:4321/` を開き、TOPページから記事へ移動できることを確認する。直接確認する場合は `http://localhost:4321/articles/<slug>/` を開く。タグ一覧は `http://localhost:4321/tags/` で確認できる。

公開前に型チェックとビルドを実行する。

```bash
pnpm check
pnpm build
```

### イベント

`src/content/events/<slug>.md` を新規作成する。

```md
---
title: 第1回 aidd.tokyo 勉強会
date: 2026-07-01T19:00:00+09:00
venue: オンライン
connpassUrl: https://example.connpass.com/event/000000/
status: upcoming
---

イベント概要を記述。
```

スキーマ詳細は `src/content.config.ts` を参照。

## デプロイ (Cloudflare Pages)

### 仕組み

`.github/workflows/site.yml` の **check + build → deploy** ジョブで自動化されている。

| トリガ | 動作 |
|---|---|
| `main` への push | 本番デプロイ (https://aidd.tokyo) |
| `main` への PR | プレビューデプロイ (`*.aidd-tokyo.pages.dev`)、PR にコメントで URL が貼られる |
| `site/**` 以外の変更 | スキップ |

### 初回セットアップ手順 (1回だけ)

1. **Cloudflare アカウントを用意** (https://dash.cloudflare.com/sign-up)
2. **API トークン作成**
   - https://dash.cloudflare.com/profile/api-tokens > **Create Token** > **Custom token**
   - Permission: `Account` > `Cloudflare Pages` > `Edit`
   - Account Resources: `Include` > 対象アカウント
   - 生成された token をコピー
3. **Account ID を確認**
   - CF ダッシュボード右サイドバー、または `https://dash.cloudflare.com/<account_id>` の URL から
4. **GitHub repo に Secrets を登録** (https://github.com/ohr486/aidd.tokyo/settings/secrets/actions)
   - `CLOUDFLARE_API_TOKEN` = 手順2で作成した token
   - `CLOUDFLARE_ACCOUNT_ID` = 手順3で確認した ID
5. **CF Pages プロジェクトを作成**
   - https://dash.cloudflare.com/?to=/:account/pages > **Create application** > **Pages** > **Direct Upload**
   - Project name: `aidd-tokyo`
   - 空のままで Create (実体は GitHub Actions から push される)
6. **GitHub Actions Variable で有効化** (https://github.com/ohr486/aidd.tokyo/settings/variables/actions)
   - `CLOUDFLARE_PAGES_ENABLED` = `true`
   - これを設定するまで deploy ジョブはスキップされる (CI は通る)
7. **カスタムドメイン設定** (任意)
   - CF Pages の `aidd-tokyo` プロジェクト > **Custom domains** > **Set up a custom domain**
   - `aidd.tokyo` を入力 (ネームサーバが Cloudflare 配下である必要あり)

### ローカルからの手動デプロイ (緊急時)

```bash
cd site
pnpm install
pnpm build

# 一度だけ wrangler でログイン
pnpm dlx wrangler login

# 本番にデプロイ
pnpm dlx wrangler pages deploy dist --project-name=aidd-tokyo --branch=main
```

通常運用ではこのコマンドは不要。GitHub Actions が自動で実行する。
