# Google Maps Geocoding アプリ

住所から緯度経度を取得し、地図上に表示するジオコーディングアプリケーションです。Google Maps Geocoding API を使用して、日本の住所を正確に地理座標に変換します。

## 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
- [プロジェクト構造](#プロジェクト構造)
- [API仕様](#api仕様)
- [料金について](#料金について)
- [トラブルシューティング](#トラブルシューティング)

## 機能

### 主要機能

- **住所検索**: 日本の住所を入力して緯度経度を取得
- **地図表示**: 検索結果をGoogle Maps埋め込み地図で表示
- **検索履歴**: LocalStorageを使用した検索履歴の保存・再利用
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **リアルタイムフィードバック**: ローディング状態とエラーハンドリング

### UI/UX

- モダンで洗練されたグラデーションデザイン
- スムーズなアニメーションとホバーエフェクト
- アクセシビリティ対応（ARIA属性、適切なラベル）
- 直感的な操作性

## 技術スタック

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x (strict mode)
- **スタイリング**: Tailwind CSS
- **API**: Google Maps Geocoding API
- **ストレージ**: LocalStorage (クライアントサイド)

## セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- Google Cloud Platform アカウント
- クレジットカード（無料枠利用にも必要）

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd example1
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Google Maps API キーの取得

詳細なセットアップ手順は [GOOGLE_MAPS_API_SETUP.md](./GOOGLE_MAPS_API_SETUP.md) を参照してください。

**簡易手順**:

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新規プロジェクトを作成
3. 請求先アカウントを設定（無料枠利用にも必須）
4. Geocoding API を有効化
5. APIキーを作成
6. APIキーを制限（セキュリティ対策）

### 4. 環境変数の設定

プロジェクトルート（`example1/`）に `.env.local` ファイルを作成:

```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**重要**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000/geocoding](http://localhost:3000/geocoding) にアクセスしてください。

## 使い方

### 基本的な検索フロー

1. **住所を入力**: 検索フォームに日本の住所を入力
   - 例: `東京都渋谷区渋谷2-21-1`
   - 例: `大阪府大阪市北区梅田3-1-1`

2. **検索実行**: 「検索」ボタンをクリック

3. **結果確認**:
   - 緯度経度の座標表示
   - Google Maps 埋め込み地図
   - フォーマットされた住所

4. **地図で詳細確認**: 「Google Mapsで開く」ボタンで新しいタブで地図を開く

### 検索履歴の活用

- 過去の検索結果は自動的にLocalStorageに保存されます
- 右側のパネルから履歴をクリックすると、結果を再表示できます
- 「クリア」ボタンで履歴を削除できます
- 最大10件まで保存されます

## プロジェクト構造

```
example1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── geocoding/
│   │   │       └── route.ts          # Geocoding APIエンドポイント
│   │   └── geocoding/
│   │       └── page.tsx              # メインページコンポーネント
│   └── types/
│       └── geocoding.ts              # TypeScript型定義
├── docs/
│   └── geocoding-app/
│       ├── README.md                  # このファイル
│       └── GOOGLE_MAPS_API_SETUP.md  # APIセットアップガイド
├── .env.local                         # 環境変数（要作成）
└── package.json
```

### 主要ファイルの説明

#### [src/app/geocoding/page.tsx](../../src/app/geocoding/page.tsx)

クライアントサイドのメインページコンポーネント。

- **状態管理**: useState による検索状態、結果、履歴管理
- **副作用**: useEffect による履歴のLocalStorage連携
- **UI**: Tailwind CSS によるレスポンシブデザイン
- **検索履歴**: LocalStorage に最大10件保存

#### [src/app/api/geocoding/route.ts](../../src/app/api/geocoding/route.ts)

サーバーサイドのAPIエンドポイント。

- **メソッド**: GET
- **パラメータ**: `?address=<住所>`
- **認証**: サーバー環境変数からAPIキーを取得
- **エラーハンドリング**: 適切なHTTPステータスコードとエラーメッセージ

#### [src/types/geocoding.ts](../../src/types/geocoding.ts)

TypeScript型定義ファイル。

```typescript
// 主要な型
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
  addressComponents: AddressComponent[];
}

export interface SearchHistory {
  id: string;
  address: string;
  result: GeocodingResult;
  timestamp: number;
}

export interface GeocodingApiResponse {
  success: boolean;
  data?: GeocodingResult;
  error?: string;
}
```

## API仕様

### エンドポイント

```
GET /api/geocoding?address=<住所>
```

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| address | string | ✓ | 検索する住所（URLエンコード必須） |

### レスポンス例

#### 成功時 (200 OK)

```json
{
  "success": true,
  "data": {
    "lat": 35.658581,
    "lng": 139.701408,
    "formattedAddress": "日本、〒150-0002 東京都渋谷区渋谷2丁目21-1",
    "placeId": "ChIJN7IxBFCMGGARnb_BzEw3xJs",
    "addressComponents": [
      {
        "longName": "日本",
        "shortName": "JP",
        "types": ["country", "political"]
      }
      // ... その他のコンポーネント
    ]
  }
}
```

#### エラー時 (400/403/500)

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

### エラーステータスコード

| コード | 説明 |
|--------|------|
| 400 | 無効なリクエスト（住所が空など） |
| 403 | APIキーの制限エラー |
| 500 | サーバーエラー / API未設定 |

## 料金について

### Google Maps Geocoding API

- **無料枠**: 月額$200のクレジット（約40,000リクエスト）
- **価格**: $5 per 1,000 requests
- **請求**: クレジットカード登録が必須（無料枠内でも）

### コスト最適化のヒント

1. **検索履歴の活用**: 同じ住所の再検索を防ぐ
2. **予算アラート設定**: Google Cloud Consoleで上限設定
3. **割り当て制限**: 1日のリクエスト数を制限

詳細は [GOOGLE_MAPS_API_SETUP.md](./GOOGLE_MAPS_API_SETUP.md) の「料金について」セクションを参照してください。

## トラブルシューティング

### APIキーエラー

**症状**: "REQUEST_DENIED" エラー

**解決方法**:
1. APIキーの制限設定を確認
2. HTTPリファラーに `http://localhost:3000/*` が含まれているか確認
3. Geocoding API が有効になっているか確認

### 検索結果が見つからない

**症状**: "ZERO_RESULTS" エラー

**解決方法**:
1. より具体的な住所を入力（都道府県から番地まで）
2. 英語表記を試す
3. 郵便番号を含める

### 環境変数が読み込まれない

**症状**: "APIキーが設定されていません" エラー

**解決方法**:
1. `.env.local` ファイルがプロジェクトルート（`example1/`）に存在するか確認
2. ファイル名が正確に `.env.local` か確認
3. 開発サーバーを再起動 (`npm run dev`)

### 検索履歴が表示されない

**症状**: 検索後に履歴パネルに表示されない

**解決方法**:
1. ブラウザのLocalStorageが有効か確認
2. シークレットモードでは履歴が保存されない可能性があります
3. ブラウザの開発者ツールでLocalStorageを確認

## 開発コマンド

```bash
# 開発サーバー起動 (http://localhost:3000)
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# コードリント
npm run lint

# 型チェック
npx tsc --noEmit
```

## セキュリティ考慮事項

### APIキー保護

- APIキーはサーバーサイド（`route.ts`）でのみ使用
- クライアントサイドには露出しない
- HTTPリファラー制限で不正利用を防止

### 入力検証

- サーバーサイドで住所のバリデーション
- XSS対策（Reactのエスケープ機能）
- URLエンコードによるインジェクション対策

## ライセンス

このプロジェクトは教育目的のトレーニング教材です。

## 参考リンク

- [Google Maps Geocoding API ドキュメント](https://developers.google.com/maps/documentation/geocoding)
- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API使用量の確認](https://console.cloud.google.com/google/maps-apis/metrics)
