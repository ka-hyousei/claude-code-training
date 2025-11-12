# 天気予報アプリ

Next.js 16.0.1とOpenWeatherMap APIを使用した天気予報アプリケーションです。

## 機能

- 都市名から天気情報を検索
- 現在の気温、体感温度、湿度、風速を表示
- リアルタイムの天気アイコン表示
- レスポンシブデザイン(Tailwind CSS使用)
- エラーハンドリングとローディング状態の表示
- Server Actionsによる型安全なAPI呼び出し

## 技術スタック

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS
- **API**: OpenWeatherMap API

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. OpenWeatherMap APIキーの取得

1. [OpenWeatherMap](https://openweathermap.org/api)にアクセス
2. アカウントを作成
3. API Keysページから無料のAPIキーを取得

### 3. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、APIキーを設定します:

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000/weather](http://localhost:3000/weather) を開きます。

## 使い方

1. 検索ボックスに都市名を英語で入力 (例: `Tokyo`, `London`, `New York`)
2. 「検索」ボタンをクリック
3. 天気情報が表示されます

### 都市名の入力例

- `Tokyo` - 東京
- `Osaka` - 大阪
- `Tokyo,JP` - より正確な結果を得るには国コード付き
- `London,GB` - ロンドン、イギリス
- `New York,US` - ニューヨーク、アメリカ

## プロジェクト構造

```
src/
├── app/
│   ├── actions/
│   │   └── weather.ts          # Server Action (天気APIの呼び出し)
│   ├── weather/
│   │   └── page.tsx            # 天気予報ページ
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # ホームページ
└── types/
    └── weather.ts              # 型定義
```

## 主要機能の実装

### Server Actions

`src/app/actions/weather.ts`で実装されたServer Actionは:

- TypeScriptによる型安全性
- 入力バリデーション
- エラーハンドリング
- 環境変数の管理

### UIコンポーネント

`src/app/weather/page.tsx`のClient Componentは:

- フォームの状態管理
- ローディング状態の表示
- エラーメッセージの表示
- レスポンシブデザイン

### 型定義

`src/types/weather.ts`で定義:

- OpenWeatherMap APIレスポンスの型
- アプリケーション内部で使用する表示用の型

## ビルドとデプロイ

### 本番ビルド

```bash
npm run build
```

### 本番サーバーの起動

```bash
npm start
```

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数`OPENWEATHER_API_KEY`を設定
3. デプロイ

## トラブルシューティング

### API キーが設定されていないエラー

`.env.local`ファイルが存在し、正しいAPIキーが設定されているか確認してください。

### 都市が見つからないエラー

- 都市名のスペルを確認
- 英語で入力されているか確認
- 国コードを追加してみる (例: `Tokyo,JP`)

### ネットワークエラー

- インターネット接続を確認
- OpenWeatherMap APIのステータスを確認

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [React Server Components](https://react.dev/reference/rsc/server-components)
