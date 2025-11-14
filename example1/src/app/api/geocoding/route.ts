import { NextRequest, NextResponse } from 'next/server';
import type { GeocodingApiResponse } from '@/types/geocoding';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  // バリデーション
  if (!address || address.trim() === '') {
    return NextResponse.json<GeocodingApiResponse>(
      {
        success: false,
        error: '住所を入力してください',
      },
      { status: 400 }
    );
  }

  // Google Maps APIキーの確認
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not configured');
    return NextResponse.json<GeocodingApiResponse>(
      {
        success: false,
        error: 'APIキーが設定されていません。管理者に連絡してください',
      },
      { status: 500 }
    );
  }

  try {
    // Google Maps Geocoding APIへのリクエスト
    const geocodingUrl = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    geocodingUrl.searchParams.append('address', address);
    geocodingUrl.searchParams.append('key', apiKey);
    geocodingUrl.searchParams.append('language', 'ja'); // 日本語レスポンス

    const response = await fetch(geocodingUrl.toString());

    if (!response.ok) {
      throw new Error(`Geocoding API returned ${response.status}`);
    }

    const data = await response.json();

    // APIレスポンスの確認
    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json<GeocodingApiResponse>({
        success: false,
        error: '指定された住所が見つかりませんでした。別の住所を試してください',
      });
    }

    if (data.status === 'REQUEST_DENIED') {
      console.error('Geocoding API request denied:', data.error_message);
      return NextResponse.json<GeocodingApiResponse>(
        {
          success: false,
          error: 'APIリクエストが拒否されました。APIキーを確認してください',
        },
        { status: 403 }
      );
    }

    if (data.status !== 'OK') {
      console.error('Geocoding API error:', data.status, data.error_message);
      return NextResponse.json<GeocodingApiResponse>({
        success: false,
        error: `ジオコーディングエラー: ${data.status}`,
      });
    }

    // 最初の結果を取得
    const result = data.results[0];

    return NextResponse.json<GeocodingApiResponse>({
      success: true,
      data: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: result.address_components.map((component: any) => ({
          longName: component.long_name,
          shortName: component.short_name,
          types: component.types,
        })),
      },
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json<GeocodingApiResponse>(
      {
        success: false,
        error: '住所の取得に失敗しました。しばらく待ってから再度お試しください',
      },
      { status: 500 }
    );
  }
}
