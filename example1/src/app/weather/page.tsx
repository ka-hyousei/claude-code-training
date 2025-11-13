'use client';

import { useState } from 'react';
import { getWeather } from '@/app/actions/weather';
import type { WeatherDisplay } from '@/types/weather';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setWeather(null);
    setIsLoading(true);

    try {
      const result = await getWeather(city);

      if (result.success) {
        setWeather(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // タイムスタンプを現地時刻にフォーマット
  const formatLocalTime = (timestamp: number, timezoneOffset: number) => {
    // タイムスタンプ（秒）をミリ秒に変換し、タイムゾーンオフセットを適用
    const localTime = new Date((timestamp + timezoneOffset) * 1000);

    // UTC時刻として扱い、日時をフォーマット
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    const hours = String(localTime.getUTCHours()).padStart(2, '0');
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');

    return {
      date: `${year}年${month}月${day}日`,
      time: `${hours}:${minutes}`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">🌤️</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            天気予報
          </h1>
          <p className="text-lg sm:text-xl text-blue-50 font-light">
            世界中の天気を多言語で検索
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-blue-100">
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🇯🇵 日本語</span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🇨🇳 中文</span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🇰🇷 한국어</span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🇬🇧 English</span>
          </div>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSubmit} className="mb-8" role="search">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6">
            <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-2">
              都市名を入力
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="city-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="例: 東京, 北京, Seoul, London..."
                className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 placeholder-gray-400 text-base transition-all"
                disabled={isLoading}
                aria-label="都市名を入力"
                aria-required="true"
              />
              <button
                type="submit"
                disabled={isLoading || !city.trim()}
                className="sm:w-auto w-full px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap"
                aria-label={isLoading ? '検索中' : '天気を検索'}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    検索中
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    検索
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center" role="status" aria-live="polite">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
              aria-label="読み込み中"
            ></div>
            <p className="text-gray-600">天気情報を取得中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    検索エラー
                  </h3>
                  <p className="text-red-50 text-sm sm:text-base">
                    天気情報を取得できませんでした
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 text-2xl">⚠️</div>
                <div>
                  <p className="text-gray-800 font-medium text-base sm:text-lg mb-2">
                    {error}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  解決方法
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    <span>都市名のスペルを確認してください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">2.</span>
                    <span>英語表記を試してみてください（例: Tokyo）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">3.</span>
                    <span>主要都市名で検索してください</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">4.</span>
                    <span>国コードを追加してみてください（例: Tokyo,JP）</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  対応都市: 東京、北京、서울、London など主要都市
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 天気情報表示 */}
        {weather && !isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* 都市名と国 */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                    {weather.city}
                  </h2>
                  <p className="text-blue-100 text-lg">{weather.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base text-blue-100">
                    {formatLocalTime(weather.timestamp, weather.timezone).date}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">
                    {formatLocalTime(weather.timestamp, weather.timezone).time}
                  </p>
                  <p className="text-xs text-blue-200 mt-1">現地時刻</p>
                </div>
              </div>
            </div>

            {/* 天気アイコンと気温 */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                <div className="relative">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                    alt={`${weather.description}のアイコン`}
                    className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-lg"
                    loading="lazy"
                    width={160}
                    height={160}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" aria-label={`気温 ${weather.temperature}度`}>
                    {weather.temperature}°C
                  </div>
                  <p className="text-xl sm:text-2xl text-gray-700 font-medium capitalize mt-2">
                    {weather.description}
                  </p>
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl mb-2">🌡️</div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">体感温度</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {weather.feelsLike}°C
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 sm:p-5 text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl mb-2">💧</div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">湿度</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {weather.humidity}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-4 sm:p-5 text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl mb-2">💨</div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">風速</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {weather.windSpeed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 使い方のヒント */}
        {!weather && !error && !isLoading && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-white border border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> 使い方
            </h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <span className="text-xl">🌏</span>
                <div>
                  <p className="font-semibold mb-1">多言語対応</p>
                  <p className="text-blue-50">日本語、中国語、韓国語、英語で都市名を入力できます</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold mb-1">入力例</p>
                  <div className="text-blue-50 space-y-1">
                    <p>• 日本語: 東京、大阪、京都</p>
                    <p>• 中国語: 北京、上海、서울</p>
                    <p>• 英語: Tokyo, London, Paris</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-semibold mb-1">より正確な検索</p>
                  <p className="text-blue-50">都市名,国コード (例: Tokyo,JP) で検索すると精度が向上します</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
