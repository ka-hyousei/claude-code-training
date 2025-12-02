# プロジェクトアーキテクチャ説明書

## 概要

このプロジェクトは**Next.js 16.0.1 (App Router)**を使用したフルスタックWebアプリケーションです。

---

## フレームワーク構成

### 🎨 フロントエンド

#### 1. Next.js 16.0.1 (App Router)
**役割**: フロントエンドフレームワーク・メタフレームワーク

**特徴**:
- **React 19.2.0**ベース
- **App Router**アーキテクチャ採用
- サーバーコンポーネント(RSC)とクライアントコンポーネントのハイブリッド
- ファイルベースルーティング
- 自動コード分割とルートプリフェッチング

**ディレクトリ構造**:
```
src/app/
├── page.tsx              # ホームページ (/)
├── layout.tsx            # ルートレイアウト
├── geocoding/
│   └── page.tsx         # /geocoding
├── weather/
│   └── page.tsx         # /weather
├── currency/
│   └── page.tsx         # /currency
├── github/
│   └── page.tsx         # /github
├── todo/
│   └── page.tsx         # /todo
├── gallery/
│   └── page.tsx         # /gallery
├── markdown/
│   └── page.tsx         # /markdown
├── api/                 # API Routes
│   ├── geocoding/
│   ├── currency/
│   ├── github/
│   └── images/
└── actions/             # Server Actions
    └── weather.ts
```

#### 2. React 19.2.0
**役割**: UIライブラリ

**新機能**:
- **React Server Components (RSC)**: サーバー側でのレンダリング
- **Automatic JSX Runtime**: `import React`不要
- **Improved Hooks**: useOptimistic, useFormStatus等
- **Actions**: フォーム送信の簡素化

**使用しているフック**:
- `useState`: クライアント状態管理
- `useEffect`: 副作用処理（LocalStorage連携等）
- `useFormState`: フォーム状態管理

#### 3. TypeScript 5.x
**役割**: 型安全性の提供

**設定** (tsconfig.json):
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,           // 厳格な型チェック
    "jsx": "react-jsx",       // React 19の自動JSXランタイム
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]      // エイリアス設定
    }
  }
}
```

#### 4. Tailwind CSS 3.4.1
**役割**: ユーティリティファーストCSSフレームワーク

**特徴**:
- クラスベースのスタイリング
- レスポンシブデザイン対応
- カスタムグラデーション・アニメーション

**使用例**:
```tsx
<button className="px-8 py-3 bg-gradient-to-br from-purple-600
                   via-violet-600 to-purple-700 text-white
                   font-bold rounded-xl hover:scale-105
                   transition-all">
  検索
</button>
```

---

### ⚙️ バックエンド

#### 1. Next.js API Routes
**場所**: `src/app/api/**/route.ts`

**仕組み**:
- ファイルベースのAPIエンドポイント
- `route.ts`ファイルでHTTPメソッドをエクスポート
- サーバーレス関数として動作

**実装例** (src/app/api/geocoding/route.ts):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  // バリデーション
  if (!address?.trim()) {
    return NextResponse.json(
      { success: false, error: '住所を入力してください' },
      { status: 400 }
    );
  }

  // 外部API呼び出し
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?...`
  );
  const data = await response.json();

  // レスポンス返却
  return NextResponse.json({
    success: true,
    data: { lat: ..., lng: ... }
  });
}
```

**実装されているAPI**:
1. `/api/geocoding` - Google Maps Geocoding API連携
2. `/api/currency` - ExchangeRate API連携
3. `/api/github` - GitHub API連携
4. `/api/images` - Unsplash API連携

#### 2. Server Actions
**場所**: `src/app/actions/weather.ts`

**仕組み**:
- `'use server'`ディレクティブで定義
- クライアントから直接呼び出し可能
- 自動的にPOSTリクエストとして処理される

**実装例**:
```typescript
'use server';

export async function getWeather(cityName: string) {
  // バリデーション
  if (!cityName?.trim()) {
    return { success: false, error: 'エラーメッセージ' };
  }

  // APIキー検証
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'APIキーが設定されていません' };
  }

  // 外部API呼び出し
  const response = await fetch(`https://api.openweathermap.org/...`);
  const data = await response.json();

  return { success: true, data };
}
```

**使用方法** (クライアントコンポーネントから):
```typescript
'use client';

import { getWeather } from '@/app/actions/weather';

const result = await getWeather('Tokyo');
```

---

## 動作原理

### 📊 レンダリングフロー

#### 1. 初回アクセス時
```
ブラウザ
  ↓ GET /weather
Next.jsサーバー
  ↓ Server Component レンダリング
  ↓ HTML生成
  ↓ React Server Component Payload (RSC)
  ↓ JavaScript Bundle
ブラウザ
  ↓ Hydration (React復元)
完全にインタラクティブなページ
```

#### 2. クライアント側ナビゲーション
```
ユーザーがリンククリック
  ↓
Next.js Router (クライアント側)
  ↓ prefetch済みデータ使用
  ↓ または fetch RSC payload
高速なページ遷移 (SPAライク)
```

#### 3. API呼び出しフロー
```
クライアントコンポーネント
  ↓ fetch('/api/geocoding?address=東京')
Next.js API Route (/api/geocoding/route.ts)
  ↓ バリデーション
  ↓ 外部API呼び出し (Google Maps API)
  ↓ データ処理・変換
  ↓ JSON レスポンス
クライアント
  ↓ 状態更新 (useState)
UI再レンダリング
```

#### 4. Server Actions フロー
```
クライアントコンポーネント
  ↓ await getWeather('Tokyo')
Next.js (自動POST処理)
  ↓ Server Action実行
  ↓ 外部API呼び出し (OpenWeather API)
  ↓ データ返却
クライアント
  ↓ 結果を受け取り
UI更新
```

---

## コンポーネント分類

### Server Components (デフォルト)
**特徴**:
- サーバーでのみ実行
- データベース・APIに直接アクセス可能
- バンドルサイズに含まれない
- ブラウザAPIは使用不可

**該当ファイル**:
- `layout.tsx` (ルートレイアウト)

### Client Components ('use client')
**特徴**:
- `'use client'`ディレクティブで明示
- ブラウザで実行
- useState, useEffectなどのフック使用可能
- イベントハンドラー使用可能

**該当ファイル**:
- 全てのpage.tsx (インタラクティブなUI)

---

## データフロー

### 1. 外部API連携パターン

#### パターンA: API Routes経由
```typescript
// クライアント (src/app/geocoding/page.tsx)
const response = await fetch('/api/geocoding?address=東京');
const data = await response.json();

// API Route (src/app/api/geocoding/route.ts)
export async function GET(request) {
  const response = await fetch('https://maps.googleapis.com/...');
  return NextResponse.json({ success: true, data });
}
```

**メリット**:
- APIキーをサーバー側で隠蔽
- CORS問題を回避
- レスポンスのキャッシュ制御が可能

#### パターンB: Server Actions経由
```typescript
// クライアント (src/app/weather/page.tsx)
'use client';
import { getWeather } from '@/app/actions/weather';

const result = await getWeather('Tokyo');

// Server Action (src/app/actions/weather.ts)
'use server';
export async function getWeather(cityName: string) {
  const response = await fetch('https://api.openweathermap.org/...');
  return { success: true, data };
}
```

**メリット**:
- タイプセーフ (TypeScript型が保持される)
- 自動シリアライゼーション
- エンドポイント定義不要

### 2. クライアント状態管理

#### useState パターン
```typescript
'use client';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    const result = await getWeather(city);
    setWeather(result.data);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={city} onChange={(e) => setCity(e.target.value)} />
      {isLoading && <p>読み込み中...</p>}
      {weather && <WeatherDisplay data={weather} />}
    </form>
  );
}
```

### 3. LocalStorage連携パターン

```typescript
'use client';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
}
```

---

## 外部API連携

### 1. Google Maps Geocoding API
**用途**: 住所→緯度経度変換

**エンドポイント**: `/api/geocoding`

**データフロー**:
```
ユーザー入力 "東京都"
  ↓
クライアント → /api/geocoding?address=東京都
  ↓
Next.js API Route
  ↓
Google Maps Geocoding API
  ↓
レスポンス { lat: 35.6812, lng: 139.7671 }
  ↓
クライアントで地図表示
```

### 2. OpenWeather API
**用途**: 天気情報取得

**エンドポイント**: Server Action `getWeather()`

**データフロー**:
```
ユーザー入力 "Tokyo"
  ↓
クライアント → getWeather('Tokyo')
  ↓
Server Action
  ↓ 都市名を英語に変換 (cityMapping)
  ↓
OpenWeather API
  ↓
レスポンス { temp: 20, description: "晴れ" }
  ↓
クライアントで表示
```

### 3. ExchangeRate API
**用途**: 通貨換算

**エンドポイント**: `/api/currency`

**データフロー**:
```
ユーザー入力: 100 USD
  ↓
クライアント → /api/currency?amount=100&from=USD
  ↓
Next.js API Route
  ↓
ExchangeRate API
  ↓
レスポンス { JPY: 15050, EUR: 92 }
  ↓
クライアントで各通貨の換算額表示
```

### 4. GitHub API
**用途**: ユーザー情報・リポジトリ取得

**エンドポイント**: `/api/github`

**データフロー**:
```
ユーザー入力 "octocat"
  ↓
クライアント → /api/github?username=octocat
  ↓
Next.js API Route
  ↓ GitHub API (2回呼び出し)
  ├─ /users/octocat (ユーザー情報)
  └─ /users/octocat/repos (リポジトリ一覧)
  ↓
統合レスポンス { user: {...}, repositories: [...] }
  ↓
クライアントでプロフィール・リポジトリ表示
```

### 5. Unsplash API
**用途**: 画像検索

**エンドポイント**: `/api/images`

**データフロー**:
```
ユーザー入力 "nature"
  ↓
クライアント → /api/images?query=nature&page=1&per_page=12
  ↓
Next.js API Route
  ↓
Unsplash API
  ↓
レスポンス { images: [...], total: 1000 }
  ↓
クライアントで画像グリッド表示
```

---

## ビルド・デプロイメント

### 開発モード
```bash
npm run dev
```
**動作**:
- Fast Refresh有効
- ソースマップ生成
- 詳細なエラー表示
- ホットリロード

### プロダクションビルド
```bash
npm run build
npm start
```

**最適化処理**:
1. **コード圧縮**: Terserによる最小化
2. **Tree Shaking**: 未使用コードの削除
3. **コード分割**: ルートごとにバンドル分割
4. **画像最適化**: next/imageによる自動最適化
5. **静的生成**: 可能なページはビルド時に生成

### ビルド成果物
```
.next/
├── server/           # サーバー側コード
│   ├── app/         # App Router pages
│   └── chunks/      # 共有チャンク
├── static/          # 静的ファイル
│   ├── chunks/      # JavaScriptバンドル
│   └── css/         # CSSファイル
└── cache/           # ビルドキャッシュ
```

---

## セキュリティ

### 1. 環境変数管理
```env
# .env.local (gitignoreされる)
GOOGLE_MAPS_API_KEY=xxx
OPENWEATHER_API_KEY=xxx
EXCHANGERATE_API_KEY=xxx
```

**アクセス方法**:
- サーバー側: `process.env.GOOGLE_MAPS_API_KEY`
- クライアント側: アクセス不可（セキュリティのため）

### 2. API Routeでの保護
```typescript
// APIキーはサーバー側でのみ使用
export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // クライアントには露出しない
  const response = await fetch(`...&key=${apiKey}`);
  return NextResponse.json(data);
}
```

### 3. 入力バリデーション
```typescript
// 必ず入力を検証
if (!address?.trim()) {
  return NextResponse.json(
    { success: false, error: 'エラー' },
    { status: 400 }
  );
}

// 文字数制限
if (cityName.length > 100) {
  return { success: false, error: '100文字以内' };
}

// 不正文字チェック
const validPattern = /^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF가-힣,.-]+$/;
if (!validPattern.test(cityName)) {
  return { success: false, error: '無効な文字が含まれています' };
}
```

---

## パフォーマンス最適化

### 1. 画像最適化 (next/image)
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="..."
  width={500}
  height={300}
  priority={true}        // LCPの改善
  placeholder="blur"     // ぼかしプレースホルダー
/>
```

**自動処理**:
- WebP/AVIF形式への変換
- レスポンシブ画像生成
- 遅延読み込み
- サイズ最適化

### 2. コード分割
```tsx
// 動的インポート
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>,
  ssr: false  // CSRのみ
});
```

### 3. キャッシング戦略

#### API Routeでのキャッシュ
```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);

  // 5分間キャッシュ
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );

  return response;
}
```

#### Server Actionsでのキャッシュ
```typescript
'use server';

import { unstable_cache } from 'next/cache';

export const getCachedWeather = unstable_cache(
  async (city: string) => {
    const response = await fetch('...');
    return response.json();
  },
  ['weather'],           // キャッシュキー
  { revalidate: 300 }   // 5分ごとに再検証
);
```

---

## テスト戦略

### テスティングフレームワーク
- **Jest 30.2.0**: テストランナー
- **React Testing Library 16.3.0**: コンポーネントテスト
- **@testing-library/user-event**: ユーザーインタラクションシミュレーション

### テストの種類

#### 1. Unit Tests
```typescript
// src/utils/cityMapping.test.ts
describe('translateCityName', () => {
  it('日本語の都市名を英語に変換する', () => {
    expect(translateCityName('東京')).toBe('Tokyo');
  });
});
```

#### 2. Component Tests
```typescript
// src/app/page.test.tsx
describe('Home Page', () => {
  it('ページタイトルが表示される', () => {
    render(<Home />);
    expect(screen.getByText('Claude Code Training Project'))
      .toBeInTheDocument();
  });
});
```

#### 3. Integration Tests
```typescript
// src/app/weather/page.test.tsx
it('検索成功時に天気情報が表示される', async () => {
  const user = userEvent.setup();

  // モック設定
  (getWeather as jest.Mock).mockResolvedValueOnce({
    success: true,
    data: { temp: 20, description: '晴れ' }
  });

  render(<WeatherPage />);

  // ユーザー操作
  const input = screen.getByPlaceholderText('都市名を入力');
  await user.type(input, 'Tokyo');
  await user.click(screen.getByRole('button', { name: '検索' }));

  // 検証
  await waitFor(() => {
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });
});
```

---

## まとめ

### フロントエンド技術スタック
```
React 19.2.0 (UIライブラリ)
  ↓
Next.js 16.0.1 App Router (メタフレームワーク)
  ↓
TypeScript 5.x (型安全性)
  ↓
Tailwind CSS (スタイリング)
```

### バックエンド技術スタック
```
Next.js API Routes (RESTful API)
  ↓
Server Actions (RPC風API)
  ↓
外部API連携
  ├─ Google Maps
  ├─ OpenWeather
  ├─ ExchangeRate
  ├─ GitHub
  └─ Unsplash
```

### アーキテクチャの特徴
✅ **フルスタック**: フロント・バックエンド統合
✅ **型安全**: TypeScriptによる厳格な型チェック
✅ **モダンReact**: Server ComponentsとClient Componentsのハイブリッド
✅ **APIキー保護**: サーバー側でのみAPIキー使用
✅ **テスト充実**: 143テストで品質保証
✅ **パフォーマンス**: 自動最適化と効率的なキャッシング
