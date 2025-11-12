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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">天気予報アプリ</h1>
          <p className="text-blue-100">都市名を入力して天気を確認しよう</p>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSubmit} className="mb-8" role="search">
          <div className="flex gap-2">
            <label htmlFor="city-input" className="sr-only">
              都市名
            </label>
            <input
              id="city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="都市名を入力 (例: Tokyo)"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-white focus:outline-none text-gray-800 placeholder-gray-400"
              disabled={isLoading}
              aria-label="都市名を入力"
              aria-required="true"
            />
            <button
              type="submit"
              disabled={isLoading || !city.trim()}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={isLoading ? '検索中' : '天気を検索'}
            >
              {isLoading ? '検索中...' : '検索'}
            </button>
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
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4" role="alert" aria-live="assertive">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-red-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* 天気情報表示 */}
        {weather && !isLoading && (
          <div className="bg-white rounded-lg shadow-xl p-6 animate-fadeIn">
            {/* 都市名と国 */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                {weather.city}, {weather.country}
              </h2>
              {/* 日付と時刻 */}
              <div className="mt-2 text-gray-600">
                <p className="text-sm">
                  {formatLocalTime(weather.timestamp, weather.timezone).date}
                </p>
                <p className="text-lg font-semibold">
                  {formatLocalTime(weather.timestamp, weather.timezone).time}
                  <span className="text-sm font-normal ml-2">(現地時刻)</span>
                </p>
              </div>
            </div>

            {/* 天気アイコンと気温 */}
            <div className="flex items-center justify-center mb-6">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={`${weather.description}のアイコン`}
                className="w-32 h-32"
                loading="lazy"
                width={128}
                height={128}
              />
              <div className="ml-4">
                <div className="text-6xl font-bold text-gray-800" aria-label={`気温 ${weather.temperature}度`}>
                  {weather.temperature}°C
                </div>
                <p className="text-xl text-gray-600 capitalize mt-2">
                  {weather.description}
                </p>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">体感温度</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.feelsLike}°C
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">湿度</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.humidity}%
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 col-span-2">
                <p className="text-sm text-gray-600 mb-1">風速</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.windSpeed} m/s
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 使い方のヒント */}
        {!weather && !error && !isLoading && (
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-white">
            <h3 className="font-semibold mb-2">💡 使い方</h3>
            <ul className="text-sm space-y-1">
              <li>• 都市名を英語で入力してください (例: Tokyo, London)</li>
              <li>• 日本の都市も検索できます (例: Osaka, Sapporo)</li>
              <li>• より正確な結果を得るには、都市名と国コードを入力してください (例: Tokyo,JP)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
