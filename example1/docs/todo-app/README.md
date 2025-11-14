# TODOリスト

タスク管理を簡単にする、LocalStorage永続化機能付きのTODOリストアプリケーションです。

## 機能概要

- **タスク追加**: 新しいタスクを簡単に追加
- **完了/未完了の切り替え**: チェックボックスでタスクの状態を管理
- **タスク削除**: 不要なタスクを削除
- **フィルター機能**: すべて/未完了/完了でタスクを絞り込み
- **LocalStorage永続化**: ブラウザにデータを自動保存
- **統計表示**: 全タスク数、未完了数、完了数をリアルタイム表示
- **完了済み一括削除**: 完了したタスクをまとめて削除
- **レスポンシブデザイン**: デスクトップ、タブレット、スマートフォンに対応
- **美しいUI**: グレー→紫→バイオレットのグラデーション

## 技術スタック

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **永続化**: LocalStorage API
- **状態管理**: React useState + useEffect

## セットアップ

### 1. 依存関係のインストール

```bash
cd example1
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000/todo` にアクセスしてください。

## 使い方

### 1. タスクを追加

1. 上部の入力欄にタスクを入力
2. 「追加」ボタンをクリック、またはEnterキーを押す
3. タスクがリストの一番上に追加されます

### 2. タスクを完了にする

- タスク左側のチェックボックスをクリック
- 完了したタスクは打ち消し線とグレーの文字で表示
- もう一度クリックすると未完了に戻ります

### 3. タスクを削除

- タスクにマウスをホバー
- 右側に表示されるゴミ箱アイコンをクリック
- タスクが即座に削除されます

### 4. フィルターを使用

**フィルターボタン:**
- **すべて**: すべてのタスクを表示
- **未完了**: 未完了のタスクのみ表示
- **完了**: 完了したタスクのみ表示

各ボタンにはタスク数が表示されます。

### 5. 完了済みタスクを一括削除

- 完了したタスクがある場合、「完了済みを削除」ボタンが表示
- クリックすると完了したタスクがすべて削除されます

## データの永続化

### LocalStorageの仕組み

このアプリは以下のように動作します：

1. **初回起動時**: デフォルトのタスクは表示されません（空の状態）
2. **タスク追加時**: 自動的にLocalStorageに保存
3. **ページリロード時**: LocalStorageからタスクを復元
4. **データの保存場所**: ブラウザのLocalStorage（キー: `todos`）

### データのクリア方法

ブラウザの開発者ツールを使用：

1. F12キーを押して開発者ツールを開く
2. **Application** タブ（または **Storage** タブ）を選択
3. 左側のメニューから **Local Storage** を展開
4. `http://localhost:3000` を選択
5. `todos` キーを右クリックして削除

## ファイル構成

```
example1/
├── src/
│   ├── app/
│   │   └── todo/
│   │       └── page.tsx              # TODOリストのフロントエンド
│   └── types/
│       └── todo.ts                    # 型定義（Todo、FilterType）
└── docs/
    └── todo-app/
        └── README.md                  # このファイル
```

## 主要コンポーネント

### 1. フロントエンドページ (`src/app/todo/page.tsx`)

**状態管理:**
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [inputText, setInputText] = useState('');
const [filter, setFilter] = useState<FilterType>('all');
const [isLoaded, setIsLoaded] = useState(false);
```

**主要機能:**

1. **タスク追加 (`addTodo`)**
   - 空白のみの入力を防止
   - IDとして現在のタイムスタンプを使用
   - 新しいタスクをリストの先頭に追加

2. **タスク切り替え (`toggleTodo`)**
   - `id`でタスクを特定
   - `completed`の真偽値を反転

3. **タスク削除 (`deleteTodo`)**
   - `id`でタスクをフィルタリングして削除

4. **完了済み削除 (`clearCompleted`)**
   - `completed: false`のタスクのみ保持

5. **フィルター処理 (`filteredTodos`)**
   - `all`: すべて表示
   - `active`: `!completed`のみ
   - `completed`: `completed`のみ

**LocalStorage同期:**
```typescript
// 読み込み
useEffect(() => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    setTodos(JSON.parse(savedTodos));
  }
  setIsLoaded(true);
}, []);

// 保存
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}, [todos, isLoaded]);
```

### 2. 型定義 (`src/types/todo.ts`)

```typescript
export interface Todo {
  id: string;              // タイムスタンプ文字列
  text: string;            // タスクのテキスト
  completed: boolean;      // 完了状態
  createdAt: string;       // ISO形式の作成日時
}

export type FilterType = 'all' | 'active' | 'completed';
```

## UI/UXの特徴

### デザインシステム

- **カラースキーム**: ダークテーマ（グレー900→紫900→バイオレット900）
- **統計ボックス**:
  - 白い半透明背景
  - 3カラムグリッド（全タスク、未完了、完了）
  - 数字に色分け（白、黄色、緑）
- **タスクカード**:
  - 白背景（95%不透明度）
  - ホバー時に紫のハイライト
  - チェックボックスは紫色
  - 完了タスクは打ち消し線とグレー表示

### インタラクティブ要素

1. **追加ボタン**
   - グラデーション背景（紫→バイオレット）
   - ホバー時の光沢効果
   - プラスアイコン付き
   - 入力が空の時は無効化

2. **チェックボックス**
   - ホバー時に拡大（scale-110）
   - 完了時は紫色の背景にチェックマーク
   - 未完了時は透明の背景

3. **削除ボタン**
   - ホバー時のみ表示（opacity-0 → opacity-100）
   - ゴミ箱アイコン
   - 赤色のホバー効果

4. **フィルターボタン**
   - アクティブなフィルターは白背景
   - 非アクティブは半透明背景
   - 各ボタンにタスク数表示

5. **レスポンシブ対応**
   - モバイル: 縦積みレイアウト
   - タブレット: 2カラム統計グリッド
   - デスクトップ: 3カラム統計グリッド

## エラーハンドリング

### LocalStorage エラー

```typescript
try {
  setTodos(JSON.parse(savedTodos));
} catch (error) {
  console.error('Failed to parse todos from localStorage:', error);
}
```

- JSONパースエラーをキャッチ
- エラー時は空のリストで開始
- コンソールにエラーを記録

## パフォーマンス最適化

### 1. 効率的な状態更新

```typescript
// map を使用して特定のタスクのみ更新
setTodos(todos.map(todo =>
  todo.id === id ? { ...todo, completed: !todo.completed } : todo
));

// filter を使用して削除
setTodos(todos.filter(todo => todo.id !== id));
```

### 2. 条件付きレンダリング

- フィルター処理されたタスクのみレンダリング
- 空の状態に応じた表示切り替え
- ホバー時の要素のみアニメーション

### 3. useEffectの依存関係管理

- 不要な再レンダリングを防止
- `isLoaded`フラグで初回読み込みを制御

## トラブルシューティング

### 問題: タスクが保存されない

**原因:**
- LocalStorageが無効化されている
- プライベートブラウジングモード
- ブラウザの容量制限

**解決策:**
1. 通常のブラウジングモードを使用
2. ブラウザの設定でLocalStorageを有効化
3. 不要なデータをクリア

### 問題: タスクが表示されない

**原因:**
- LocalStorageのデータが破損
- JSONパースエラー

**解決策:**
1. ブラウザの開発者ツールを開く
2. Consoleタブでエラーを確認
3. LocalStorageの `todos` キーを削除
4. ページをリロード

### 問題: 削除ボタンが表示されない

**原因:**
- マウスがタスクの上にない
- タッチデバイスでホバー効果が動作しない

**解決策:**
1. デスクトップ: タスクの上にマウスをホバー
2. モバイル: CSSを調整して常に表示

## 今後の拡張案

1. **ドラッグ&ドロップ**: タスクの並び替え機能
2. **カテゴリー/タグ**: タスクを分類
3. **期限設定**: タスクに期限を追加
4. **優先度**: 重要度の設定
5. **検索機能**: タスクのテキスト検索
6. **編集機能**: タスクのテキストを編集
7. **エクスポート/インポート**: JSON形式でデータ管理
8. **クラウド同期**: 複数デバイス間で同期
9. **通知機能**: 期限が近いタスクの通知
10. **統計グラフ**: 完了率や時系列グラフ
11. **テーマ切り替え**: ライト/ダークモード
12. **ショートカットキー**: キーボードで操作

## アクセシビリティ

- **ARIA ラベル**: すべてのボタンと入力欄にラベル付け
- **キーボード操作**: Enterキーでタスク追加
- **スクリーンリーダー対応**: 適切なHTML構造
- **コントラスト**: WCAG AAレベルの色コントラスト
- **フォーカス表示**: 明確なフォーカスリング

## セキュリティ

- **XSS対策**: Reactの自動エスケープ機能
- **LocalStorage**: クライアント側のみ、機密情報は保存しない
- **入力バリデーション**: 空白のみのタスクを防止

## ライセンス

このプロジェクトはトレーニング目的で作成されています。

## 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
