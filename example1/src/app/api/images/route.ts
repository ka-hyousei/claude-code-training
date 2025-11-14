import { NextRequest, NextResponse } from 'next/server';
import type { ImageGalleryApiResponse, UnsplashSearchResponse } from '@/types/unsplash';

// Unsplash Access Key (デモ用 - 本番環境では環境変数を使用)
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '12';

  // バリデーション
  if (!query || query.trim() === '') {
    return NextResponse.json<ImageGalleryApiResponse>(
      {
        success: false,
        error: '検索キーワードを入力してください',
      },
      { status: 400 }
    );
  }

  // Access Keyのチェック
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
    return NextResponse.json<ImageGalleryApiResponse>(
      {
        success: false,
        error: 'Unsplash APIキーが設定されていません。環境変数 UNSPLASH_ACCESS_KEY を設定してください。',
      },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (response.status === 401) {
      return NextResponse.json<ImageGalleryApiResponse>(
        {
          success: false,
          error: 'Unsplash APIキーが無効です',
        },
        { status: 401 }
      );
    }

    if (response.status === 403) {
      return NextResponse.json<ImageGalleryApiResponse>(
        {
          success: false,
          error: 'APIリクエスト制限に達しました。しばらく待ってから再度お試しください',
        },
        { status: 403 }
      );
    }

    if (!response.ok) {
      throw new Error(`Unsplash API returned ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();

    return NextResponse.json<ImageGalleryApiResponse>({
      success: true,
      data: {
        images: data.results,
        total: data.total,
        totalPages: data.total_pages,
      },
    });
  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json<ImageGalleryApiResponse>(
      {
        success: false,
        error: '画像の取得に失敗しました。しばらく待ってから再度お試しください',
      },
      { status: 500 }
    );
  }
}
