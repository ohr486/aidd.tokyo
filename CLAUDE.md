# AGENTS.md / CLAUDE.md

このファイルは、Claude Code (claude.ai/code) や Codex など、本リポジトリで作業するAIコーディングエージェント全般へのガイダンスを提供する。`AGENTS.md` は本ファイル (`CLAUDE.md`) へのシンボリックリンクであり、内容は常に同一である。

## プロジェクト概要

**aidd.tokyo** — aidd.tokyoプロジェクトのモノレポ。トップレベルは独立して発展するサブプロジェクト群で構成される:

- `site/` — Webサイト (Astro 6 / Tailwind CSS v4 / pnpm)。詳細は `site/README.md` を参照。

## リポジトリの状態

リポジトリ全体を横断するビルド/lint/テストコマンドは**存在しない**。各サブプロジェクトが自分のツールチェーンを `site/package.json` のような形で自己完結して管理する方針 (依存はサブプロジェクトに閉じる)。

そのため次の点に注意すること:

- ルート直下に汎用ツールチェーン (npm workspaces / pnpm workspaces / Turborepo / Nx 等) はまだ導入されていない。複数サブプロジェクトを横断する必要が出てから検討する。
- 作業対象のサブプロジェクトに `cd` してから、そのディレクトリのコマンド (例: `site/` なら `pnpm dev` / `pnpm build` / `pnpm check`) を実行する。

## CI / デプロイ

- `.github/workflows/site.yml` が `site/**` の変更に対して **check + build → Cloudflare Pages deploy** を実行する。`main` push は本番、PR はプレビュー。
- 初回セットアップ (CF API token / Account ID / GitHub Variable) は `site/README.md` の「デプロイ (Cloudflare Pages)」節を参照。

## サブプロジェクト追加時の方針

新しいサブプロジェクト (例: `site/` 内のWebアプリ) を立ち上げる際は:

1. そのディレクトリ内で自己完結したツールチェーンを選定する (依存はサブプロジェクトに閉じる)。
2. ディレクトリ直下に独自の `README.md` と、必要であれば固有の `CLAUDE.md` を置く。ルートのCLAUDE.mdはモノレポ全体の俯瞰のみを担い、サブプロジェクト固有の詳細は重複させない。
3. ルートにモノレポ管理ツールを導入する場合は本ファイルにビルド/テストコマンドを追記する。
