'use client';

import { useState } from 'react';
import type { GitHubApiResponse, GitHubUser, GitHubRepository } from '@/types/github';

export default function GitHubPage() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<{ user: GitHubUser; repositories: GitHubRepository[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
      const data: GitHubApiResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'ユーザー情報の取得に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      console.error('GitHub search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">🐙</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            GitHub ユーザー検索
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 font-light">
            GitHubユーザーのプロフィールとリポジトリを検索
          </p>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHubユーザー名を入力 (例: octocat)"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-white placeholder-gray-400 text-base leading-6 transition-all h-[50px]"
                disabled={isLoading}
                aria-label="GitHubユーザー名を入力"
                aria-required="true"
              />
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="group relative sm:w-auto w-full px-8 py-3 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-[50px] shadow-xl hover:shadow-2xl"
                aria-label={isLoading ? '検索中' : 'ユーザーを検索'}
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
                      <span className="text-base tracking-wide">検索中...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-base tracking-wide">検索</span>
                    </span>
                  )}
                </span>

                {/* 下部のアクセント */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </form>

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">検索エラー</h3>
                <p className="text-red-50">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果 */}
        {result && !isLoading && (
          <div className="space-y-6">
            {/* ユーザープロフィール */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <img
                    src={result.user.avatar_url}
                    alt={result.user.login}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {result.user.name || result.user.login}
                    </h2>
                    <p className="text-lg text-purple-100 mb-2">@{result.user.login}</p>
                    {result.user.bio && <p className="text-purple-50 mb-3 text-sm">{result.user.bio}</p>}
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <a
                        href={result.user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
                      >
                        プロフィールを見る
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(result.user.public_repos)}</div>
                  <div className="text-xs text-gray-600 mt-1">リポジトリ</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(result.user.followers)}</div>
                  <div className="text-xs text-gray-600 mt-1">フォロワー</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(result.user.following)}</div>
                  <div className="text-xs text-gray-600 mt-1">フォロー中</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(result.user.public_gists)}</div>
                  <div className="text-xs text-gray-600 mt-1">Gists</div>
                </div>
              </div>

              {(result.user.location || result.user.company || result.user.blog || result.user.twitter_username) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {result.user.company && (
                        <div className="text-gray-700">
                          <span className="font-medium">会社:</span> {result.user.company}
                        </div>
                      )}
                      {result.user.location && (
                        <div className="text-gray-700">
                          <span className="font-medium">場所:</span> {result.user.location}
                        </div>
                      )}
                      {result.user.blog && (
                        <div className="text-gray-700">
                          <span className="font-medium">ブログ:</span>{' '}
                          <a href={result.user.blog} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                            {result.user.blog}
                          </a>
                        </div>
                      )}
                      {result.user.twitter_username && (
                        <div className="text-gray-700">
                          <span className="font-medium">Twitter:</span>{' '}
                          <a href={`https://twitter.com/${result.user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            @{result.user.twitter_username}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* リポジトリ一覧 */}
            {result.repositories.length > 0 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6">
                  <h3 className="text-2xl font-bold text-white">最近更新されたリポジトリ</h3>
                </div>
                <div className="p-6 space-y-4">
                  {result.repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-bold text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          {repo.name}
                        </a>
                        {repo.fork && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Fork</span>
                        )}
                      </div>
                      {repo.description && <p className="text-gray-700 mb-3">{repo.description}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div>
                          ⭐ {formatNumber(repo.stargazers_count)}
                        </div>
                        <div>
                          🍴 {formatNumber(repo.forks_count)}
                        </div>
                        <div className="text-gray-500">更新: {formatDate(repo.updated_at)}</div>
                      </div>
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {repo.topics.map((topic) => (
                            <span key={topic} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <p className="font-semibold mb-1">ユーザー名を入力</p>
                  <p className="text-purple-100">検索したいGitHubユーザー名を入力してください (例: octocat)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="font-semibold mb-1">検索ボタンをクリック</p>
                  <p className="text-purple-100">ユーザーのプロフィールとリポジトリが表示されます</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm text-purple-100">
                  💡 データは5分間キャッシュされます
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
