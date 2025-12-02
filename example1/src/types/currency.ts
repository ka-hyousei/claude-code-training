// ExchangeRate-API のレスポンス型
export interface ExchangeRateApiResponse {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: Record<string, number>;
}

// 通貨換算結果の型
export interface CurrencyConversion {
  currency: string;
  rate: number;
  amount: number;
  symbol: string;
  name: string;
}

// APIレスポンスの型
export interface CurrencyApiResponse {
  success: boolean;
  data?: {
    baseCurrency: string;
    baseAmount: number;
    conversions: CurrencyConversion[];
    lastUpdated: string;
  };
  error?: string;
}

// 主要通貨の情報
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

// 主要通貨リスト
export const MAJOR_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", name: "アメリカドル", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "ユーロ", symbol: "€", flag: "🇪🇺" },
  { code: "JPY", name: "日本円", symbol: "¥", flag: "🇯🇵" },
  { code: "GBP", name: "イギリスポンド", symbol: "£", flag: "🇬🇧" },
  { code: "CNY", name: "中国元", symbol: "¥", flag: "🇨🇳" },
  { code: "KRW", name: "韓国ウォン", symbol: "₩", flag: "🇰🇷" },
  { code: "AUD", name: "オーストラリアドル", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "カナダドル", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "スイスフラン", symbol: "Fr", flag: "🇨🇭" },
  { code: "HKD", name: "香港ドル", symbol: "HK$", flag: "🇭🇰" },
  { code: "SGD", name: "シンガポールドル", symbol: "S$", flag: "🇸🇬" },
  { code: "INR", name: "インドルピー", symbol: "₹", flag: "🇮🇳" },
];

// 通貨コードから情報を取得
export function getCurrencyInfo(code: string): CurrencyInfo {
  const currency = MAJOR_CURRENCIES.find((c) => c.code === code);
  if (currency) return currency;

  // 見つからない場合はデフォルト値
  return {
    code,
    name: code,
    symbol: code,
    flag: "🌍",
  };
}
