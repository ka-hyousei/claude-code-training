# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Claude Codeのハンズオン講習用トレーニングプロジェクト。以下の構成でClaude Codeの機能を段階的に学習する。

## プロジェクト構造

```
claude-code-training/
├── .claude/                  # Claude Code設定
│   ├── commands/            # カスタムスラッシュコマンド
│   │   └── review-custom.md # コードレビューコマンド
│   └── settings.local.json  # WebSearch権限設定
├── example1/                # Next.js 15 サンプルプロジェクト
│   ├── src/app/            # App Router
│   └── package.json        # Next.js依存関係
├── homework/                # 宿題・課題ファイル
│   └── note.txt            # 宿題メモ
└── issues/                 # 学習タスク(task1.md～task11.md)
```

## 開発コマンド

### example1プロジェクト(Next.js)

```bash
# 開発サーバー起動
cd example1
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リント
npm run lint
```

### ハンズオン進行

issuesディレクトリのタスクを順番に実行:

1. **task1.md** - Claude Codeのインストール
2. **task2.md** - プロジェクト初期化
3. **task3.md** - WebSearch設定
4. **task4.md** - WebSearchでNext.js理解
5. **task5.md** - カスタムコマンド作成
6. **task6.md** - サブエージェント作成
7. **task7.md** - 新機能実装(総合演習)
8. **task8.md** - 高度なカスタマイズ
9. **task9.md** - 実践的なワークフロー
10. **task10.md** - チーム開発での活用
11. **task11.md** - まとめと次のステップ

## アーキテクチャ

### example1 (Next.jsプロジェクト)

- **Next.js 15** - App Router使用
- **React 19** - Server Components/Client Components
- **TypeScript** - 型安全性
- **ESLint** - コード品質

### 主要な学習目標

1. **カスタムコマンド**: `.claude/commands/`に配置し、プロジェクト固有の操作を効率化
2. **サブエージェント**: `.claude/agents/`に配置し、専門的なレビューやタスクを自律実行
3. **WebSearch**: Next.js等の最新情報取得

## 重要な設定ファイル

### `.claude/settings.local.json`

WebSearch権限を付与済み。他のツールの権限も必要に応じて追加可能。

### `.claude/commands/review-custom.md`

コードレビュー用スラッシュコマンド。以下の観点でチェック:
- コード品質(可読性、構造、重複)
- ベストプラクティス
- セキュリティ(機密情報、脆弱性)
- TypeScript型定義
- テストの必要性
- ドキュメント

## 開発時の注意点

### Next.js 15の特徴

- **App Router**: `example1/src/app/`配下がルート構造
- **Server Components**: デフォルトでサーバーコンポーネント
- **Client Components**: `"use client"`ディレクティブで明示

### カスタムコマンド/サブエージェント作成時

- **カスタムコマンド**: シンプルな指示のショートカット向け
- **サブエージェント**: 複雑な自律タスク・専門分析向け
- 両者ともMarkdown形式(`.md`)
- Git管理してチームで共有推奨

## このプロジェクトでの作業方針

1. **issuesのタスクを順次進める**: task1から順に実行し、Claude Codeの機能を習得
2. **example1で実験**: Next.jsプロジェクトを使って新機能やレビューを試す
3. **カスタムコマンド/エージェントを活用**: 効率的なワークフロー構築

## 出力言語

**日本語で出力すること** - ユーザーへの全ての説明、レビュー結果、コメントは日本語で記述する
