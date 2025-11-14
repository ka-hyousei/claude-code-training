import { NextRequest, NextResponse } from 'next/server';
import type {
  CurrencyApiResponse,
  ExchangeRateApiResponse,
  CurrencyConversion,
} from '@/types/currency';
import { getCurrencyInfo, MAJOR_CURRENCIES } from '@/types/currency';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const baseCurrency = searchParams.get('from');
  const amount = searchParams.get('amount');
  const targetCurrenciesParam = searchParams.get('to');

  // バリデーション
  if (!baseCurrency || baseCurrency.trim() === '') {
    return NextResponse.json<CurrencyApiResponse>(
      {
        success: false,
        error: '基準通貨を選択してください',
      },
      { status: 400 }
    );
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json<CurrencyApiResponse>(
      {
        success: false,
        error: '有効な金額を入力してください',
      },
      { status: 400 }
    );
  }

  try {
    // ExchangeRate-API へのリクエスト（APIキー不要）
    const apiUrl = `https://open.exchangerate-api.com/v6/latest/${baseCurrency.toUpperCase()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      throw new Error(`Exchange Rate API returned ${response.status}`);
    }

    const data: ExchangeRateApiResponse = await response.json();

    // APIレスポンスの確認
    if (data.result === 'error') {
      return NextResponse.json<CurrencyApiResponse>({
        success: false,
        error: '為替レートの取得に失敗しました。通貨コードを確認してください',
      });
    }

    // 換算先通貨のリスト
    let targetCurrencies: string[];
    if (targetCurrenciesParam && targetCurrenciesParam.trim() !== '') {
      targetCurrencies = targetCurrenciesParam.split(',').map((c) => c.trim().toUpperCase());
    } else {
      // デフォルトは主要通貨（基準通貨を除く）
      targetCurrencies = MAJOR_CURRENCIES.filter((c) => c.code !== baseCurrency.toUpperCase()).map(
        (c) => c.code
      );
    }

    // 換算結果を生成
    const conversions: CurrencyConversion[] = targetCurrencies
      .filter((currency) => data.rates[currency] !== undefined)
      .map((currency) => {
        const rate = data.rates[currency];
        const info = getCurrencyInfo(currency);
        return {
          currency,
          rate,
          amount: Number(amount) * rate,
          symbol: info.symbol,
          name: info.name,
        };
      });

    if (conversions.length === 0) {
      return NextResponse.json<CurrencyApiResponse>({
        success: false,
        error: '指定された通貨の為替レートが見つかりませんでした',
      });
    }

    return NextResponse.json<CurrencyApiResponse>({
      success: true,
      data: {
        baseCurrency: baseCurrency.toUpperCase(),
        baseAmount: Number(amount),
        conversions,
        lastUpdated: data.time_last_update_utc,
      },
    });
  } catch (error) {
    console.error('Currency API error:', error);
    return NextResponse.json<CurrencyApiResponse>(
      {
        success: false,
        error: '為替レートの取得に失敗しました。しばらく待ってから再度お試しください',
      },
      { status: 500 }
    );
  }
}
