# 画像検索ギャラリー

Unsplash APIを使用した美しい画像検索とギャラリー表示アプリケーションです。

## 機能概要

- **キーワード検索**: 英語キーワードで画像を検索
- **グリッドレイアウト**: レスポンシブな画像グリッド表示
- **モーダルビュー**: クリックで画像を拡大表示
- **無限スクロール風**: 「もっと見る」ボタンで追加読み込み
- **作者情報表示**: 写真家のプロフィールと名前
- **いいね数表示**: 各画像のいいね数
- **Next.js Image最適化**: 自動的に最適なサイズで配信
- **サーバーサイドキャッシング**: 1時間のキャッシュでAPI呼び出しを削減

## 技術スタック

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **API**: Unsplash API
- **画像最適化**: Next.js Image component

## セットアップ

### 1. Unsplash APIキーの取得

1. [Unsplash Developers](https://unsplash.com/developers) にアクセス
2. アカウントを作成またはログイン
3. 「New Application」をクリック
4. アプリケーション情報を入力
5. Access Keyをコピー

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# .env.local
UNSPLASH_ACCESS_KEY=your_access_key_here
```

**注意**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### 3. 依存関係のインストール

```bash
cd example1
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000/gallery` にアクセスしてください。

## 使い方

### 1. 画像を検索

1. 検索ボックスに英語のキーワードを入力（例: nature, cat, mountain）
2. 「検索」ボタンをクリック、またはEnterキーを押す
3. 画像がグリッド形式で表示されます

### 2. 画像を拡大表示

- 任意の画像をクリック
- モーダルウィンドウで拡大表示
- 作者情報、説明、いいね数が表示
- 「元の画像を見る」ボタンで Unsplash のオリジナルページへ
- 「作者のページ」ボタンで作者のポートフォリオへ
- モーダル外をクリックまたは「×」ボタンで閉じる

### 3. もっと見る

- 下部の「もっと見る」ボタンをクリック
- 次のページの画像が追加で読み込まれます
- 最後のページまで表示すると、ボタンは非表示になります

### 検索のヒント

**良いキーワードの例:**
- nature (自然)
- city (都市)
- food (食べ物)
- people (人物)
- architecture (建築)
- travel (旅行)
- technology (テクノロジー)

**複数キーワード:**
- "sunset beach" (夕日のビーチ)
- "coffee shop" (コーヒーショップ)
- "mountain landscape" (山の風景)

## APIについて

### Unsplash API

このアプリは [Unsplash API](https://unsplash.com/developers) を使用しています。

**特徴:**
- 無料で高品質な写真
- 1時間あたり50リクエスト（無料プラン）
- 商用利用可能な写真
- 写真家のクレジット表示が必要

**使用エンドポイント:**

```
GET https://api.unsplash.com/search/photos
```

**パラメータ:**
- `query`: 検索キーワード（必須）
- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの画像数（デフォルト: 12）

**レスポンス例:**
```json
{
  "total": 1000,
  "total_pages": 84,
  "results": [
    {
      "id": "abc123",
      "urls": {
        "raw": "https://...",
        "full": "https://...",
        "regular": "https://...",
        "small": "https://...",
        "thumb": "https://..."
      },
      "alt_description": "A beautiful sunset",
      "user": {
        "name": "John Doe",
        "username": "johndoe",
        "portfolio_url": "https://..."
      },
      "likes": 1234
    }
  ]
}
```

## ファイル構成

```
example1/
├── src/
│   ├── app/
│   │   ├── gallery/
│   │   │   └── page.tsx              # 画像検索ギャラリーのフロントエンド
│   │   └── api/
│   │       └── images/
│   │           └── route.ts           # Unsplash API連携エンドポイント
│   └── types/
│       └── unsplash.ts                # 型定義（Unsplash API）
├── .env.local.example                 # 環境変数のサンプル
└── docs/
    └── gallery-app/
        └── README.md                  # このファイル
```

## 主要コンポーネント

### 1. フロントエンドページ (`src/app/gallery/page.tsx`)

**状態管理:**
```typescript
const [query, setQuery] = useState('');
const [images, setImages] = useState<UnsplashImage[]>([]);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);
```

**主要機能:**

1. **検索 (`searchImages`)**
   - ページ1: 既存の画像を置き換え
   - ページ2以降: 既存の画像に追加
   ```typescript
   if (pageNum === 1) {
     setImages(data.data.images);
   } else {
     setImages([...images, ...data.data.images]);
   }
   ```

2. **無限スクロール風読み込み (`loadMore`)**
   - 次のページを読み込み
   - 最後のページまで表示すると非表示

3. **モーダル表示**
   - 画像クリックで拡大表示
   - 背景クリックで閉じる
   - ESCキーでも閉じる（予定）

**画像グリッド:**
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {images.map((image) => (
    <div className="aspect-square relative">
      <Image
        src={image.urls.small}
        alt={image.alt_description || 'Unsplash image'}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
    </div>
  ))}
</div>
```

### 2. APIルート (`src/app/api/images/route.ts`)

**パラメータ:**
- `query`: 検索キーワード（必須）
- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの画像数（デフォルト: 12）

**処理フロー:**
1. バリデーション（キーワードが空でないか、APIキーが設定されているか）
2. Unsplash APIへのリクエスト
3. レスポンスの整形と返却

**エラーハンドリング:**
- 400: キーワードが空
- 401: APIキーが無効
- 403: レート制限超過
- 500: その他のエラー

**レスポンス:**
```typescript
{
  success: boolean;
  data?: {
    images: UnsplashImage[];
    total: number;
    totalPages: number;
  };
  error?: string;
}
```

### 3. 型定義 (`src/types/unsplash.ts`)

```typescript
export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    profile_image: { small: string; medium: string; large: string; };
  };
  likes: number;
  created_at: string;
  width: number;
  height: number;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface ImageGalleryApiResponse {
  success: boolean;
  data?: {
    images: UnsplashImage[];
    total: number;
    totalPages: number;
  };
  error?: string;
}
```

## パフォーマンス最適化

### 1. サーバーサイドキャッシング

Next.jsの `fetch` APIに `revalidate` オプションを設定：

```typescript
const response = await fetch(url, {
  headers: {
    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    'Accept-Version': 'v1',
  },
  next: { revalidate: 3600 }, // 1時間キャッシュ
});
```

- 同じ検索クエリへの複数リクエストでAPI呼び出しを削減
- Unsplash APIのレート制限対策

### 2. Next.js Image最適化

```typescript
<Image
  src={image.urls.small}
  alt={image.alt_description || 'Unsplash image'}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
/>
```

- 自動的に最適なサイズで配信
- WebP形式に自動変換（対応ブラウザ）
- 遅延読み込み（lazy loading）

### 3. 無限スクロール風読み込み

- 初回は12枚のみ読み込み
- 「もっと見る」ボタンで追加読み込み
- ページ分割でメモリ使用量を抑制

## UI/UXの特徴

### デザインシステム

- **カラースキーム**: ダークテーマ（グレー900→紫900→バイオレット900）
- **レイアウト**:
  - グリッド: レスポンシブ（1/2/3/4カラム）
  - アスペクト比: 正方形（aspect-square）
- **カード**:
  - 白背景（95%不透明度）
  - ホバー時に拡大（scale-105）
  - 影が濃くなる

### インタラクティブ要素

1. **検索ボタン**
   - グラデーション背景（紫→バイオレット）
   - ホバー時の光沢効果
   - ローディングスピナー
   - 検索アイコン付き

2. **画像カード**
   - ホバー時にグラデーションオーバーレイ
   - 作者名といいね数が下から出現
   - クリックでモーダル表示

3. **モーダル**
   - 黒い半透明背景（90%）
   - 拡大画像と詳細情報
   - 外側クリックで閉じる
   - 「×」ボタンで閉じる

4. **もっと見るボタン**
   - 半透明の白背景
   - ホバー時に少し明るく
   - ローディング中は無効化

5. **レスポンシブ対応**
   - モバイル: 1カラム
   - タブレット: 2カラム
   - デスクトップ: 3カラム
   - ワイド: 4カラム

## エラーハンドリング

### バリデーションエラー

- キーワードが入力されていない

### APIエラー

- **401 Unauthorized**: APIキーが無効
- **403 Forbidden**: レート制限超過
- **500 Server Error**: Unsplash APIの呼び出し失敗
- **Network Error**: ネットワーク接続の問題

すべてのエラーは美しいエラー画面で表示されます：
- 赤→ピンクのグラデーション背景
- 明確なエラータイトル
- わかりやすいエラーメッセージ

## トラブルシューティング

### 問題: 「Unsplash APIキーが設定されていません」エラー

**原因:**
- `.env.local` ファイルが存在しない
- `UNSPLASH_ACCESS_KEY` が設定されていない
- 環境変数が読み込まれていない

**解決策:**
1. `.env.local` ファイルを作成
2. `UNSPLASH_ACCESS_KEY=your_access_key_here` を追加
3. 開発サーバーを再起動（`npm run dev`）
4. ブラウザをリフレッシュ

### 問題: 「Unsplash APIキーが無効です」エラー

**原因:**
- APIキーが間違っている
- APIキーが削除された
- Unsplashアカウントが停止された

**解決策:**
1. [Unsplash Developers](https://unsplash.com/developers) でAPIキーを確認
2. 正しいAccess Keyをコピー
3. `.env.local` を更新
4. 開発サーバーを再起動

### 問題: 「APIリクエスト制限に達しました」エラー

**原因:**
- 1時間に50リクエストを超過（無料プラン）
- 開発中に頻繁に検索を実行

**解決策:**
1. 1時間待つ（制限がリセット）
2. キャッシュが効いているので、同じ検索は再度API呼び出しされません
3. 本番環境では有料プランを検討（5000リクエスト/時間）

### 問題: 画像が表示されない

**原因:**
- ブラウザの画像ブロック設定
- UnsplashのCDNの問題
- Next.js Imageの設定ミス

**解決策:**
1. ブラウザの設定を確認
2. `next.config.ts` に以下を追加：
   ```typescript
   images: {
     domains: ['images.unsplash.com'],
   }
   ```
3. 開発サーバーを再起動

### 問題: モーダルが閉じられない

**原因:**
- JavaScriptエラー
- イベントリスナーの問題

**解決策:**
1. ブラウザのコンソールでエラーを確認
2. モーダル外をクリック
3. 「×」ボタンをクリック
4. ページをリフレッシュ

## レート制限について

Unsplash APIは以下のレート制限があります：

### 無料プラン（Demo）
- **50リクエスト/時間**
- 開発とテスト用

### 本番プラン（Production）
- **5000リクエスト/時間**
- 商用アプリケーション用
- 申請が必要

**制限を避けるには:**
- サーバーサイドキャッシング（1時間）を活用
- 同じ検索を頻繁に実行しない
- 本番環境では Production プランを使用

## 今後の拡張案

1. **検索履歴**: LocalStorageに検索履歴を保存
2. **お気に入り機能**: 画像をブックマーク
3. **フィルター**: 画像の向き（縦/横）、色でフィルタリング
4. **ソート機能**: 関連度、最新、人気でソート
5. **コレクション**: Unsplashのコレクションを表示
6. **ダウンロード機能**: 画像を直接ダウンロード
7. **共有機能**: SNSで画像を共有
8. **画像詳細**: EXIF情報、撮影場所、カメラ情報
9. **関連画像**: 選択した画像に関連する画像を表示
10. **キーボードナビゲーション**: 矢印キーで画像を切り替え

## Unsplashガイドライン

Unsplash APIを使用する際は、以下のガイドラインに従う必要があります：

1. **クレジット表示**: 写真家の名前とUnsplashへのリンク
2. **トラッキング**: ダウンロードイベントをトラッキング（本番環境）
3. **ホットリンク禁止**: 画像を再ホストしない
4. **商用利用**: 許可されているが、写真自体を販売することは禁止

このアプリは既にクレジット表示を実装しています：
- モーダルに作者名を表示
- 作者のポートフォリオへのリンク
- 元の画像へのリンク

## セキュリティ

- **APIキー保護**: 環境変数で管理、クライアントに公開されない
- **入力バリデーション**: サーバー側で厳格な検証
- **XSS対策**: Reactの自動エスケープ機能
- **HTTPS**: 本番環境ではHTTPS通信を推奨
- **外部リンク**: `target="_blank"` と `rel="noopener noreferrer"` で安全性確保

## Vercelへのデプロイ

### 1. 環境変数の設定

Vercelダッシュボードで環境変数を設定：

1. プロジェクトを選択
2. **Settings** → **Environment Variables**
3. `UNSPLASH_ACCESS_KEY` を追加
4. 値にAccess Keyを入力
5. **Save**

### 2. デプロイ

```bash
git add .
git commit -m "Add image gallery feature"
git push
```

Vercelが自動的にデプロイします。

## ライセンス

このプロジェクトはトレーニング目的で作成されています。

Unsplashの画像は [Unsplash License](https://unsplash.com/license) に従います：
- 商用・非商用問わず無料で使用可能
- 写真家のクレジット表示が推奨（必須ではない）
- 写真自体を販売することは禁止

## 関連リンク

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash Developers](https://unsplash.com/developers)
- [Unsplash License](https://unsplash.com/license)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
