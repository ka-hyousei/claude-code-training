# Google Maps Geocoding API セットアップガイド

## 料金について

### 無料枠
- **月額$200の無料クレジット**が提供されます
- Geocoding APIは$5 per 1,000 requests
- **月40,000リクエストまで無料**で利用可能

### 注意事項
- クレジットカード登録が必須（無料枠内でも）
- 無料枠を超えると自動的に課金されます
- 予算アラートの設定を推奨します

## セットアップ手順

### 1. Google Cloud Console へアクセス

https://console.cloud.google.com/

### 2. 新規プロジェクトを作成

1. 「プロジェクトの選択」→「新しいプロジェクト」
2. プロジェクト名を入力（例: "geocoding-app"）
3. 「作成」をクリック

### 3. 請求先アカウントの設定

1. 左メニュー「お支払い」→「請求先アカウントをリンク」
2. クレジットカード情報を入力
3. 請求先アカウントを有効化

**重要**: 無料枠内でも請求先の設定が必須です

### 4. Geocoding API を有効化

1. 左メニュー「APIとサービス」→「ライブラリ」
2. "Geocoding API" を検索
3. 「有効にする」をクリック

### 5. APIキーを作成

1. 左メニュー「認証情報」
2. 「認証情報を作成」→「APIキー」
3. APIキーが生成されます

### 6. APIキーを制限（セキュリティ対策）

**必ず実施してください！**

1. 作成したAPIキーの「編集」をクリック
2. 「アプリケーションの制限」を設定:
   - **開発環境**: HTTPリファラー
     - `http://localhost:3000/*` を追加
   - **本番環境**: HTTPリファラー
     - `https://yourdomain.com/*` を追加

3. 「APIの制限」を設定:
   - 「キーを制限」を選択
   - "Geocoding API" のみにチェック

4. 「保存」をクリック

### 7. 環境変数に設定

`.env.local` ファイルを作成:

```bash
GOOGLE_MAPS_API_KEY=あなたのAPIキー
```

**注意**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません

## 課金を防ぐための設定

### 1. 予算アラートを設定

1. Google Cloud Console → 「お支払い」
2. 「予算とアラート」→「予算を作成」
3. 金額を設定（例: $10）
4. アラート閾値を設定（例: 50%, 90%, 100%）
5. 通知先メールアドレスを設定

### 2. 割り当て制限を設定

1. 「APIとサービス」→「割り当て」
2. "Geocoding API" を検索
3. 「1日あたりのリクエスト数」を制限（例: 1,000）

### 3. APIキーの使用状況を監視

1. 「APIとサービス」→「ダッシュボード」
2. Geocoding APIの使用状況を定期的に確認

## 開発中の注意点

### リクエスト数を抑える工夫

1. **検索履歴を活用**
   - LocalStorageに保存した履歴を再利用
   - 同じ住所の再検索を防ぐ

2. **デバウンス処理**（オプション）
   - 入力中に連続してAPIを叩かない
   - ユーザーが入力を止めてから検索

3. **キャッシング**
   - サーバー側で検索結果をキャッシュ

## 無料の代替案

Google Maps APIが高額になる場合の代替案:

### 1. OpenStreetMap Nominatim（完全無料）

**メリット**:
- 完全無料
- APIキー不要
- 使用制限が緩い

**デメリット**:
- 精度がGoogle Mapsより低い
- レスポンスが遅い場合がある
- 商用利用に制限あり

**API例**:
```
https://nominatim.openstreetmap.org/search?q=東京都渋谷区&format=json
```

### 2. Mapbox Geocoding API

**メリット**:
- 月50,000リクエストまで無料
- Google Mapsより無料枠が大きい

**デメリット**:
- 精度はGoogle Mapsと同等だが、日本の住所に弱い場合がある

## トラブルシューティング

### エラー: "REQUEST_DENIED"

**原因**: APIキーの制限設定が厳しすぎる

**解決方法**:
1. APIキーの「HTTPリファラー」に `http://localhost:3000/*` が含まれているか確認
2. 「APIの制限」で Geocoding API が有効になっているか確認

### エラー: "OVER_QUERY_LIMIT"

**原因**: 1日のリクエスト数制限を超えた

**解決方法**:
1. 翌日まで待つ
2. 割り当て制限を増やす（有料）
3. キャッシングを実装

### エラー: "ZERO_RESULTS"

**原因**: 入力された住所が見つからない

**解決方法**:
1. より具体的な住所を入力
2. 英語表記を試す
3. 郵便番号を含める

## 参考リンク

- [Google Maps Platform 料金](https://mapsplatform.google.com/pricing/)
- [Geocoding API ドキュメント](https://developers.google.com/maps/documentation/geocoding)
- [API使用量の確認](https://console.cloud.google.com/google/maps-apis/metrics)
- [請求先アカウント管理](https://console.cloud.google.com/billing)
