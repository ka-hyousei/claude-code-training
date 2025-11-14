'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultMarkdown = `# Markdownエディターへようこそ

## 機能

このエディターは以下の機能をサポートしています：

- **リアルタイムプレビュー**: 左側で入力すると右側に即座に反映
- **GitHub Flavored Markdown**: テーブル、タスクリスト、打ち消し線など
- **シンタックスハイライト**: コードブロックに色付け
- **自動保存**: ブラウザに自動保存されます

## 使い方

### 見出し

\`#\` を使って見出しを作成できます：

\`\`\`
# H1 見出し
## H2 見出し
### H3 見出し
\`\`\`

### リスト

**箇条書きリスト**:
- 項目1
- 項目2
  - サブ項目2.1
  - サブ項目2.2

**番号付きリスト**:
1. 最初の項目
2. 2番目の項目
3. 3番目の項目

### タスクリスト

- [x] 完了したタスク
- [ ] 未完了のタスク
- [ ] もう一つのタスク

### テーブル

| 機能 | サポート | 説明 |
|------|---------|------|
| Markdown | ✅ | 基本的なMarkdown構文 |
| GFM | ✅ | GitHub Flavored Markdown |
| ハイライト | ✅ | コードのシンタックスハイライト |

### コードブロック

\`\`\`javascript
// JavaScriptのコード例
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
# Pythonのコード例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### 引用

> これは引用です。
> 複数行にわたって書くこともできます。

### リンクと画像

[リンクのテキスト](https://example.com)

![画像の代替テキスト](https://via.placeholder.com/150)

### 強調

**太字のテキスト**
*斜体のテキスト*
~~打ち消し線~~

### 水平線

---

## さあ、始めましょう！

左側のエディターでこのテキストを編集してみてください。
変更は自動的にブラウザに保存されます。
`;

  // LocalStorageから読み込み
  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    } else {
      setMarkdown(defaultMarkdown);
    }
    setIsLoaded(true);
  }, []);

  // LocalStorageに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('markdown', markdown);
    }
  }, [markdown, isLoaded]);

  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('本当にすべてクリアしますか？この操作は元に戻せません。')) {
      setMarkdown('');
    }
  };

  const handleReset = () => {
    if (confirm('デフォルトのテキストに戻しますか？現在の内容は失われます。')) {
      setMarkdown(defaultMarkdown);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* ヘッダー */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📝</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Markdownエディター</h1>
                <p className="text-sm text-purple-200">リアルタイムプレビュー機能付き</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                エクスポート
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                リセット
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                クリア
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* エディターとプレビュー */}
      <div className="max-w-[1920px] mx-auto h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
          {/* エディター */}
          <div className="flex flex-col border-r border-white/20">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                編集
              </h2>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-4 bg-gray-900/50 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ここにMarkdownを入力..."
              spellCheck={false}
            />
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 border-t border-white/20">
              <p className="text-xs text-purple-200">
                {markdown.length} 文字 | {markdown.split('\n').length} 行
              </p>
            </div>
          </div>

          {/* プレビュー */}
          <div className="flex flex-col">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                プレビュー
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-white">
              <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900 prose-code:text-purple-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {markdown || '*プレビューがここに表示されます...*'}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
