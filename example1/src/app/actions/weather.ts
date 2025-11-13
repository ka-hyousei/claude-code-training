'use server';

import type { WeatherData, WeatherDisplay } from '@/types/weather';
import { isWeatherError, isWeatherData } from '@/types/weather';

/**
 * 都市名から天気情報を取得するServer Action
 * @param city 都市名
 * @returns 天気情報またはエラーメッセージ
 */
export async function getWeather(
  city: string
): Promise<{ success: true; data: WeatherDisplay } | { success: false; error: string }> {
  // 入力バリデーション
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    return {
      success: false,
      error: '都市名を入力してください',
    };
  }

  if (trimmedCity.length > 100) {
    return {
      success: false,
      error: '都市名が長すぎます',
    };
  }

  // 危険な文字のチェック（英字、日本語、スペース、カンマ、ハイフン、ピリオドを許可）
  // 日本語: ひらがな(\u3040-\u309F)、カタカナ(\u30A0-\u30FF)、漢字(\u4E00-\u9FFF)
  if (!/^[a-zA-Z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\s,.-]+$/.test(trimmedCity)) {
    return {
      success: false,
      error: '都市名には英字、日本語、スペース、カンマ、ハイフン、ピリオドのみ使用できます',
    };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'API キーが設定されていません。環境変数 OPENWEATHER_API_KEY を設定してください。',
    };
  }

  try {
    // URLSearchParamsを使用して安全にパラメータを構築
    const params = new URLSearchParams({
      q: trimmedCity,
      appid: apiKey,
      units: 'metric',
      lang: 'ja',
    });
    const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

    const response = await fetch(url, {
      // Next.js 15以降のデフォルトはno-storeだが、明示的に指定
      cache: 'no-store',
    });

    // エラーレスポンスの処理（response.okを先にチェック）
    if (!response.ok) {
      const errorData = await response.json();
      if (isWeatherError(errorData)) {
        return {
          success: false,
          error: errorData.message || '天気情報の取得に失敗しました',
        };
      }
      return {
        success: false,
        error: `天気情報の取得に失敗しました (ステータス: ${response.status})`,
      };
    }

    const data = await response.json();

    // 型ガードを使用してデータを検証
    if (!isWeatherData(data)) {
      return {
        success: false,
        error: '天気データの形式が不正です',
      };
    }

    // 天気データの配列が空でないことを確認
    if (!data.weather || data.weather.length === 0) {
      return {
        success: false,
        error: '天気データが不完全です',
      };
    }

    // 表示用データに変換
    const displayData: WeatherDisplay = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      icon: data.weather[0].icon,
      timestamp: data.dt,
      timezone: data.timezone,
    };

    return {
      success: true,
      data: displayData,
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました。しばらくしてから再度お試しください。',
    };
  }
}
