'use client';

import { useState, useEffect } from 'react';
import type { GeocodingResult, SearchHistory } from '@/types/geocoding';

const STORAGE_KEY = 'geocoding_history';
const MAX_HISTORY = 10;

export default function GeocodingPage() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  // LocalStorageから履歴を読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Failed to parse history:', err);
      }
    }
  }, []);

  // 履歴を保存
  const saveToHistory = (searchAddress: string, searchResult: GeocodingResult) => {
    const newEntry: SearchHistory = {
      id: `${Date.now()}-${Math.random()}`,
      address: searchAddress,
      result: searchResult,
      timestamp: Date.now(),
    };

    const newHistory = [newEntry, ...history.filter((h) => h.address !== searchAddress)].slice(
      0,
      MAX_HISTORY
    );
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // 履歴をクリア
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 履歴から選択
  const selectFromHistory = (item: SearchHistory) => {
    setAddress(item.address);
    setResult(item.result);
    setError(null);
  };

  // 検索実行
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/geocoding?address=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        saveToHistory(address, data.data);
      } else {
        setError(data.error || '住所の検索に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">📍</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            ジオコーディング検索
          </h1>
          <p className="text-lg sm:text-xl text-emerald-50 font-light">
            住所から緯度経度を取得して地図表示
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側: 検索フォームと結果 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 検索フォーム */}
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6">
              <label htmlFor="address-input" className="block text-sm font-medium text-gray-700 mb-2">
                住所を入力
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="例: 東京都渋谷区渋谷2-21-1"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-800 placeholder-gray-400 text-base leading-6 transition-all h-[50px]"
                  disabled={isLoading}
                  aria-label="住所を入力"
                  aria-required="true"
                />
                <button
                  type="submit"
                  disabled={isLoading || !address.trim()}
                  className="sm:w-auto w-full px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap text-base leading-6 h-[50px]"
                  aria-label={isLoading ? '検索中' : '住所を検索'}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
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
                      検索中
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      検索
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* エラー表示 */}
            {error && !isLoading && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <h3 className="text-xl font-bold text-white mb-1">検索エラー</h3>
                      <p className="text-red-50">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 結果表示 */}
            {result && !isLoading && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                {/* 住所情報 */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">検索結果</h2>
                  <p className="text-teal-50">{result.formattedAddress}</p>
                </div>

                {/* 座標情報 */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 text-center">
                      <div className="text-3xl mb-2">🌐</div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">緯度</p>
                      <p className="text-2xl font-bold text-gray-800">{result.lat.toFixed(6)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 text-center">
                      <div className="text-3xl mb-2">🧭</div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">経度</p>
                      <p className="text-2xl font-bold text-gray-800">{result.lng.toFixed(6)}</p>
                    </div>
                  </div>

                  {/* 地図埋め込み */}
                  <div className="bg-gray-100 rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps?q=${result.lat},${result.lng}&hl=ja&z=15&output=embed`}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="地図"
                      aria-label={`${result.formattedAddress}の地図`}
                    />
                  </div>

                  {/* Google Mapsリンク */}
                  <div className="mt-4 text-center">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Google Mapsで開く
                    </a>
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
                    <span className="text-xl">📝</span>
                    <div>
                      <p className="font-semibold mb-1">住所を入力</p>
                      <p className="text-teal-50">正確な住所を入力すると、より精度の高い結果が得られます</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🗺️</span>
                    <div>
                      <p className="font-semibold mb-1">地図表示</p>
                      <p className="text-teal-50">検索結果は地図上に表示され、Google Mapsで詳細を確認できます</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📚</span>
                    <div>
                      <p className="font-semibold mb-1">検索履歴</p>
                      <p className="text-teal-50">過去の検索結果は自動的に保存され、再利用できます</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右側: 検索履歴 */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  検索履歴
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    aria-label="履歴をクリア"
                  >
                    クリア
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">検索履歴はまだありません</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectFromHistory(item)}
                      className="w-full text-left p-3 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 rounded-lg transition-all transform hover:scale-105 border border-teal-200"
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">{item.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString('ja-JP')}
                      </p>
                      <div className="text-xs text-gray-600 mt-1 flex gap-3">
                        <span>緯度: {item.result.lat.toFixed(4)}</span>
                        <span>経度: {item.result.lng.toFixed(4)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
