# Markdownエディター

リアルタイムプレビュー機能とシンタックスハイライト付きのMarkdownエディターです。

## 機能概要

- **リアルタイムプレビュー**: 左側で入力すると右側に即座に反映
- **GitHub Flavored Markdown (GFM)**: テーブル、タスクリスト、打ち消し線をサポート
- **シンタックスハイライト**: コードブロックに自動で色付け
- **自動保存**: LocalStorageに自動で保存
- **エクスポート機能**: Markdownファイルとしてダウンロード
- **リセット機能**: デフォルトのサンプルテキストに戻す
- **クリア機能**: すべてのテキストを削除
- **文字数・行数カウント**: リアルタイムで表示
- **レスポンシブデザイン**: デスクトップとモバイルに対応

## 技術スタック

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + @tailwindcss/typography
- **Markdownレンダリング**: react-markdown
- **GFMサポート**: remark-gfm
- **シンタックスハイライト**: rehype-highlight + highlight.js
- **永続化**: LocalStorage API

## セットアップ

### 1. 依存関係のインストール

```bash
cd example1
npm install
```

必要なパッケージ:
- `react-markdown`: Markdownのレンダリング
- `remark-gfm`: GitHub Flavored Markdown
- `rehype-highlight`: コードのシンタックスハイライト
- `@tailwindcss/typography`: 美しいタイポグラフィ

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000/markdown` にアクセスしてください。

## 使い方

### 基本的な操作

1. **テキストを入力**: 左側のエディターにMarkdownを入力
2. **プレビューを確認**: 右側に即座にレンダリングされたHTMLが表示
3. **自動保存**: 入力内容は自動的にLocalStorageに保存

### ボタン機能

- **エクスポート**: 現在の内容を `.md` ファイルとしてダウンロード
- **リセット**: デフォルトのサンプルテキストに戻す
- **クリア**: すべてのテキストを削除（確認ダイアログ表示）

### Markdown構文

#### 見出し

```markdown
# H1 見出し
## H2 見出し
### H3 見出し
#### H4 見出し
```

#### 強調

```markdown
**太字のテキスト**
*斜体のテキスト*
~~打ち消し線~~
```

#### リスト

**箇条書きリスト:**
```markdown
- 項目1
- 項目2
  - サブ項目2.1
  - サブ項目2.2
```

**番号付きリスト:**
```markdown
1. 最初の項目
2. 2番目の項目
3. 3番目の項目
```

**タスクリスト:**
```markdown
- [x] 完了したタスク
- [ ] 未完了のタスク
```

#### リンクと画像

```markdown
[リンクのテキスト](https://example.com)
![画像の代替テキスト](https://example.com/image.png)
```

#### コードブロック

**インラインコード:**
```markdown
`const x = 10;`
```

**コードブロック:**
````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```
````

#### テーブル

```markdown
| ヘッダー1 | ヘッダー2 | ヘッダー3 |
|---------|---------|---------|
| セル1    | セル2    | セル3    |
| セル4    | セル5    | セル6    |
```

#### 引用

```markdown
> これは引用です。
> 複数行にわたって書くこともできます。
```

#### 水平線

```markdown
---
```

## サポートされているプログラミング言語

シンタックスハイライトは以下の言語をサポート:

- JavaScript / TypeScript
- Python
- Java
- C / C++ / C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- HTML / CSS
- JSON / YAML
- Bash / Shell
- SQL
- その他多数...

## ファイル構成

```
example1/
├── src/
│   ├── app/
│   │   └── markdown/
│   │       └── page.tsx              # Markdownエディターのフロントエンド
│   └── types/
│       └── (型定義なし - react-markdownの型を使用)
├── tailwind.config.ts                # Tailwind設定（typography plugin）
└── docs/
    └── markdown-app/
        └── README.md                  # このファイル
```

## 主要コンポーネント

### 1. フロントエンドページ (`src/app/markdown/page.tsx`)

**状態管理:**
```typescript
const [markdown, setMarkdown] = useState('');
const [isLoaded, setIsLoaded] = useState(false);
```

**LocalStorage同期:**
```typescript
// 読み込み
useEffect(() => {
  const savedMarkdown = localStorage.getItem('markdown');
  if (savedMarkdown) {
    setMarkdown(savedMarkdown);
  } else {
    setMarkdown(defaultMarkdown);
  }
  setIsLoaded(true);
}, []);

// 保存
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem('markdown', markdown);
  }
}, [markdown, isLoaded]);
```

**主要機能:**

1. **エクスポート (`handleExport`)**
   ```typescript
   const blob = new Blob([markdown], { type: 'text/markdown' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `markdown-${new Date().toISOString().split('T')[0]}.md`;
   a.click();
   ```
   - Blobを作成してMarkdownファイルを生成
   - ファイル名に現在の日付を含める
   - 自動ダウンロード

2. **クリア (`handleClear`)**
   - 確認ダイアログを表示
   - 確認後、空の文字列に設定

3. **リセット (`handleReset`)**
   - 確認ダイアログを表示
   - 確認後、デフォルトテキストに復元

**Markdownレンダリング:**
```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
>
  {markdown || '*プレビューがここに表示されます...*'}
</ReactMarkdown>
```

### 2. Tailwind設定 (`tailwind.config.ts`)

```typescript
plugins: [
  require('@tailwindcss/typography'),
],
```

**Typography plugin の使用:**
```typescript
<article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900 prose-code:text-purple-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
```

## UI/UXの特徴

### デザインシステム

- **カラースキーム**: ダークテーマ（グレー900→紫900→バイオレット900）
- **レイアウト**:
  - デスクトップ: 2カラム（左エディター、右プレビュー）
  - モバイル: 縦積み
- **エディター**:
  - ダーク背景（グレー900/50）
  - 白いテキスト
  - モノスペースフォント
- **プレビュー**:
  - 白背景
  - 美しいタイポグラフィ（prose classes）
  - コードブロックはダーク背景

### インタラクティブ要素

1. **ヘッダーボタン**
   - エクスポート: 緑色（ダウンロードアイコン付き）
   - リセット: 青色（リフレッシュアイコン付き）
   - クリア: 赤色（ゴミ箱アイコン付き）
   - ホバー時に少し暗く

2. **エディターエリア**
   - 紫色のフォーカスリング
   - リサイズ不可（resize-none）
   - スペルチェック無効化

3. **プレビューエリア**
   - スクロール可能
   - 読みやすいタイポグラフィ
   - リンクは紫色

4. **ステータスバー**
   - 文字数と行数をリアルタイム表示
   - 半透明の白背景

## パフォーマンス最適化

### 1. 効率的なレンダリング

```typescript
{markdown || '*プレビューがここに表示されます...*'}
```
- 空の時はプレースホルダーを表示
- Markdownが変更された時のみ再レンダリング

### 2. Highlight.js CSSのインポート

```typescript
import 'highlight.js/styles/github-dark.css';
```
- GitHub Dark テーマを使用
- コードブロックに美しいシンタックスハイライト

### 3. 画像の最適化

Next.js Imageコンポーネントは使用していませんが、ユーザーがMarkdown内で画像を使用した場合は通常のimgタグでレンダリングされます。

## データの永続化

### LocalStorageの仕組み

1. **初回起動時**: デフォルトのサンプルテキストを表示
2. **入力時**: 自動的にLocalStorageに保存（キー: `markdown`）
3. **ページリロード時**: LocalStorageからデータを復元
4. **リセット時**: デフォルトテキストに戻る

### データのクリア方法

ブラウザの開発者ツールを使用：

1. F12キーを押す
2. **Application** タブを選択
3. **Local Storage** を展開
4. `http://localhost:3000` を選択
5. `markdown` キーを削除

## トラブルシューティング

### 問題: プレビューが表示されない

**原因:**
- Markdownの構文エラー
- react-markdownのインストール漏れ

**解決策:**
1. `npm install` を実行
2. 開発サーバーを再起動
3. ブラウザのコンソールでエラーを確認

### 問題: シンタックスハイライトが効かない

**原因:**
- rehype-highlightのインストール漏れ
- highlight.js CSSの読み込み失敗

**解決策:**
1. `npm install rehype-highlight` を実行
2. `import 'highlight.js/styles/github-dark.css';` を確認
3. 開発サーバーを再起動

### 問題: エクスポートが動作しない

**原因:**
- ブラウザのダウンロード制限
- ポップアップブロッカー

**解決策:**
1. ブラウザのダウンロード許可を確認
2. ポップアップブロッカーを無効化

### 問題: データが保存されない

**原因:**
- LocalStorageが無効化されている
- プライベートブラウジングモード

**解決策:**
1. 通常のブラウジングモードを使用
2. LocalStorageを有効化

## 今後の拡張案

1. **マークダウンテンプレート**: よく使うフォーマットをプリセット
2. **複数ファイル管理**: タブで複数のMarkdownファイルを管理
3. **プレビューモード切り替え**: 編集/プレビュー/分割表示
4. **目次自動生成**: 見出しから目次を作成
5. **ショートカットキー**: Ctrl+S で保存など
6. **テーマ切り替え**: 異なるハイライトテーマを選択
7. **GitHubスタイルCSS**: より忠実なGitHub風の見た目
8. **PDFエクスポート**: MarkdownからPDFを生成
9. **画像アップロード**: ドラッグ&ドロップで画像挿入
10. **検索・置換機能**: テキスト内の検索と置換
11. **全画面モード**: エディターまたはプレビューを全画面表示
12. **クラウド同期**: GitHub Gist や Google Drive と同期

## サポートされているGFM機能

- ✅ テーブル
- ✅ タスクリスト
- ✅ 打ち消し線
- ✅ オートリンク
- ✅ コードブロックの言語指定
- ❌ 絵文字（`:emoji:` 形式は未サポート）
- ❌ 脚注（未サポート）

## アクセシビリティ

- **ARIA ラベル**: すべてのボタンにラベル付け
- **キーボード操作**: テキストエリアはフォーカス可能
- **スクリーンリーダー対応**: セマンティックなHTML構造
- **コントラスト**: 十分な色コントラスト

## セキュリティ

- **XSS対策**: react-markdownが自動でサニタイズ
- **HTML注入**: デフォルトで生のHTMLはレンダリングされない
- **LocalStorage**: クライアント側のみ、機密情報は保存しない

## パッケージ情報

### react-markdown

- **バージョン**: 最新
- **ライセンス**: MIT
- **GitHub**: https://github.com/remarkjs/react-markdown

### remark-gfm

- **バージョン**: 最新
- **ライセンス**: MIT
- **GitHub**: https://github.com/remarkjs/remark-gfm

### rehype-highlight

- **バージョン**: 最新
- **ライセンス**: MIT
- **GitHub**: https://github.com/rehypejs/rehype-highlight

## ライセンス

このプロジェクトはトレーニング目的で作成されています。

## 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [highlight.js](https://highlightjs.org/)
