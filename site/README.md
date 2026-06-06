# aidd.tokyo site

AI駆動開発コミュニティ **aidd.tokyo** のWebサイト。Astro 6 ベースの静的サイトとして構築する。

## 技術スタック

| レイヤ | 採用ツール |
|---|---|
| フレームワーク | [Astro 6](https://astro.build/) (Content Collections + MDX) |
| スタイル | [Tailwind CSS v4](https://tailwindcss.com/) (Vite Plugin) |
| コンテンツ管理 | Markdown / MDX をGit管理 (CMSは使わない) |
| ホスティング | [Cloudflare Pages](https://pages.cloudflare.com/) (予定) |
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

`src/content/articles/<slug>.mdx` を新規作成し、フロントマターを記述する。

```mdx
---
title: 記事タイトル
description: 概要 (一覧表示・OGP に使用)
publishedAt: 2026-06-06
tags: [claude-code, tutorial]
---

本文をMarkdown / MDX で記述。
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
