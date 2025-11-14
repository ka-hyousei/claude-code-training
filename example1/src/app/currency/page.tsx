'use client';

import { useState } from 'react';
import type { CurrencyApiResponse } from '@/types/currency';
import { MAJOR_CURRENCIES, getCurrencyInfo } from '@/types/currency';

export default function CurrencyPage() {
  const [amount, setAmount] = useState('100');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [result, setResult] = useState<CurrencyApiResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/currency?from=${encodeURIComponent(baseCurrency)}&amount=${encodeURIComponent(amount)}`
      );
      const data: CurrencyApiResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || '通貨換算に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      console.error('Currency conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 数値をカンマ区切りでフォーマット
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">💱</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            通貨換算ツール
          </h1>
          <p className="text-lg sm:text-xl text-purple-50 font-light">
            リアルタイムの為替レートで通貨を換算
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側: 入力フォーム */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                換算設定
              </h2>

              {/* 金額入力 */}
              <div className="mb-4">
                <label htmlFor="amount-input" className="block text-sm font-medium text-gray-700 mb-2">
                  金額
                </label>
                <input
                  id="amount-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-800 text-lg transition-all"
                  disabled={isLoading}
                  aria-label="換算する金額"
                  aria-required="true"
                />
              </div>

              {/* 基準通貨選択 */}
              <div className="mb-6">
                <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-2">
                  基準通貨
                </label>
                <select
                  id="currency-select"
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-800 text-lg transition-all bg-white"
                  disabled={isLoading}
                  aria-label="基準通貨を選択"
                >
                  {MAJOR_CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 換算ボタン */}
              <button
                type="submit"
                disabled={isLoading || !amount || Number(amount) <= 0}
                className="group relative w-full px-6 py-3 bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-[50px] shadow-xl hover:shadow-2xl"
                aria-label={isLoading ? '換算中' : '通貨を換算'}
              >
                {/* グラデーションオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 光沢効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* ボタンコンテンツ */}
                <span className="relative z-10">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-base tracking-wide">換算中...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                      <span className="text-base tracking-wide">換算する</span>
                    </span>
                  )}
                </span>

                {/* 下部のアクセント */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </div>

          {/* 右側: 結果表示 */}
          <div className="lg:col-span-2">
            {/* エラー表示 */}
            {error && !isLoading && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">換算エラー</h3>
                      <p className="text-red-50">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 換算結果 */}
            {result && !isLoading && (
              <div className="space-y-4">
                {/* 換算元情報 */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">換算元</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{getCurrencyInfo(result.baseCurrency).flag}</span>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            {getCurrencyInfo(result.baseCurrency).symbol} {formatNumber(result.baseAmount)}
                          </p>
                          <p className="text-sm text-gray-600">{getCurrencyInfo(result.baseCurrency).name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">最終更新</p>
                      <p className="text-sm text-gray-600">
                        {new Date(result.lastUpdated).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 換算結果テーブル */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <th className="px-6 py-4 text-left font-bold border border-purple-400">通貨</th>
                          <th className="px-6 py-4 text-right font-bold border border-purple-400">為替レート</th>
                          <th className="px-6 py-4 text-right font-bold border border-purple-400">換算額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.conversions.map((conversion, index) => (
                          <tr
                            key={conversion.currency}
                            className={`transition-colors hover:bg-purple-50 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 border border-gray-300">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{getCurrencyInfo(conversion.currency).flag}</span>
                                <div>
                                  <p className="font-bold text-gray-800 text-lg">{conversion.currency}</p>
                                  <p className="text-sm text-gray-500">{conversion.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right border border-gray-300">
                              <div className="flex flex-col items-end">
                                <p className="text-sm text-gray-600 font-medium">
                                  1 {result.baseCurrency} =
                                </p>
                                <p className="text-lg font-bold text-gray-800">
                                  {conversion.rate.toFixed(4)}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right border border-gray-300">
                              <p className="text-2xl font-bold text-purple-600">
                                {conversion.symbol} {formatNumber(conversion.amount)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 使い方 */}
            {!result && !error && !isLoading && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span> 使い方
                </h3>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">1️⃣</span>
                    <div>
                      <p className="font-semibold mb-1">金額を入力</p>
                      <p className="text-purple-50">換算したい金額を入力してください</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">2️⃣</span>
                    <div>
                      <p className="font-semibold mb-1">基準通貨を選択</p>
                      <p className="text-purple-50">換算元の通貨を選択してください</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">3️⃣</span>
                    <div>
                      <p className="font-semibold mb-1">換算ボタンをクリック</p>
                      <p className="text-purple-50">主要通貨への換算結果が表示されます</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <p className="text-sm text-purple-100">
                      💡 為替レートは1時間ごとに更新されます
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
