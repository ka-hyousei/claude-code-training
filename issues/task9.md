# Task 9: Vitestでテストを書く - ヘルスチェックAPIをテストしよう

## 目的
Vitestをセットアップし、Next.jsのAPIエンドポイントに対する単体テストを作成する

## 所要時間
約30-40分

## 前提条件
- Task 1-7が完了していること
- example1プロジェクトが存在すること
- APIエンドポイントが作成済みであること（`/api/health`）

## このタスクで学ぶこと
- Vitestのセットアップ方法
- Next.js API Routesのテスト手法
- テスト駆動開発（TDD）の基礎
- Claude Codeを使ったテスト作成の効率化
- テストカバレッジの確認

## 🎯 ミッション

**example1プロジェクトにVitestを導入し、ヘルスチェックAPIのテストを作成してください！**

## 📚 Vitestとは？

[Vitest](https://vitest.dev/)は、Viteベースの超高速なテストフレームワークです。

### 特徴
- ⚡ **高速**: Viteのパワーで爆速テスト実行
- 🔧 **設定不要**: Vite設定を自動で読み込み
- 🎯 **Jest互換**: JestのようなシンプルなAPI
- 📊 **カバレッジ**: ビルトインのカバレッジサポート
- 🔥 **HMR**: テストもホットリロード

### なぜVitestを使うのか？

| ツール | 特徴 | 速度 |
|-------|------|------|
| **Vitest** | Viteベース、最新、Next.js 15と相性良い | ⚡⚡⚡ |
| Jest | 最も広く使われている | 🐢 |
| Mocha | 柔軟だが設定が複雑 | 🐢 |

## 🚀 実装の進め方

### ステップ1: Vitestをインストールする（5分）

#### 1-1. Claude Codeに依頼する

```
example1プロジェクトにVitestをインストールしたいです。

以下を実行してください：
1. vitest、@vitejs/plugin-react、happy-dom をdevDependenciesにインストール
2. package.jsonにテスト用のスクリプトを追加
   - test: テストを実行
   - test:watch: ウォッチモードでテストを実行
   - test:coverage: カバレッジレポートを生成
```

#### 1-2. 期待される結果

Claude Codeが以下を実行します：

```bash
cd example1
npm install --save-dev vitest @vitest/ui happy-dom @types/node
```

`package.json`に以下のスクリプトが追加されます：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### ステップ2: Vitest設定ファイルを作成する（5分）

#### 2-1. Claude Codeに依頼する

```
Vitestの設定ファイル（vitest.config.ts）を作成してください。

以下の設定を含めてください：
- Next.jsのパスエイリアス（@/*）を解決
- happy-domをテスト環境として使用
- テストファイルのパターン設定（**/*.test.ts, **/*.test.tsx）
- グローバル設定（describe, it, expect等をインポート不要にする）
```

#### 2-2. 期待される設定ファイル

`example1/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### ステップ3: ヘルスチェックAPIのテストを作成する（10分）

```
example1/src/app/api/health/route.tsのテストを作成してください。

ファイル: example1/src/app/api/health/route.test.ts

テストケース：
1. GET リクエストが200ステータスを返すこと
2. レスポンスボディに "status": "ok" が含まれること
3. レスポンスボディに "timestamp" が含まれること
4. timestampがISO 8601形式であること

Next.jsのRoute Handlerをテストする方法を使ってください。
```

### ステップ4: テストを実行する（5分）

#### 4-1. テストを実行

```bash
cd example1
npm run test
```

#### 4-2. 期待される出力

```
✓ src/app/api/health/route.test.ts (5)
  ✓ GET /api/health (5)
    ✓ 200ステータスコードを返すこと
    ✓ レスポンスボディにstatusフィールドが含まれること
    ✓ レスポンスボディにtimestampフィールドが含まれること
    ✓ timestampがISO 8601形式であること
    ✓ レスポンスのContent-TypeがJSONであること

Test Files  1 passed (1)
     Tests  5 passed (5)
  Start at  XX:XX:XX
  Duration  XXXms
```

#### 4-3. ウォッチモードで実行

ファイル変更を監視して自動的に再実行：

```bash
npm run test:watch
```

### ステップ5: テストカバレッジを確認する（5分）

#### 5-1. カバレッジツールをインストール

```
@vitest/coverage-v8をインストールしてください
```

```bash
npm install --save-dev @vitest/coverage-v8
```

#### 5-2. vitest.config.tsにカバレッジ設定を追加

```typescript
export default defineConfig({
  // ... 既存の設定
  test: {
    // ... 既存の設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/app/api/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    },
  },
});
```

#### 5-3. カバレッジレポートを生成

```bash
npm run test:coverage
```

期待される出力：

```
Coverage report from v8
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |     100 |      100 |     100 |     100 |
 api/health/route.ts   |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|
```

カバレッジHTMLレポートは `example1/coverage/index.html` に生成されます。

### ステップ6: テストの理解を深める（5-10分）

#### 6-1. Claude Codeに質問する

```
作成したテストについて、以下を説明してください：

1. describe と it の役割の違いは？
2. expect().toBe() と expect().toEqual() の違いは？
3. なぜ async/await を使っているのか？
4. response.json() は何をしているのか？
5. toMatch() でRegexを使う理由は？
```

## ✅ 確認事項

- [ ] Vitestをインストールした
- [ ] vitest.config.tsを作成した
- [ ] ヘルスチェックAPIのテストを作成した
- [ ] すべてのテストがパスした
- [ ] テストカバレッジを確認した（100%）
- [ ] ウォッチモードの使い方を理解した
- [ ] Claude Codeでテスト作成を効率化できた
