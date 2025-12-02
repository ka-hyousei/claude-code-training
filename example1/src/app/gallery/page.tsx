"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageGalleryApiResponse, UnsplashImage } from "@/types/unsplash";

export default function GalleryPage() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchImages(1);
  };

  const searchImages = async (pageNum: number) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/images?query=${encodeURIComponent(query)}&page=${pageNum}&per_page=12`,
      );
      const data: ImageGalleryApiResponse = await response.json();

      if (data.success && data.data) {
        if (pageNum === 1) {
          setImages(data.data.images);
        } else {
          setImages([...images, ...data.data.images]);
        }
        setPage(pageNum);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.error || "画像の取得に失敗しました");
        if (pageNum === 1) {
          setImages([]);
        }
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
      console.error("Image search error:", err);
      if (pageNum === 1) {
        setImages([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      searchImages(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">🖼️</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            画像検索ギャラリー
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 font-light">
            Unsplashから美しい写真を検索
          </p>
        </div>

        {/* 検索フォーム */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="キーワードを入力 (例: nature, cat, mountain)"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-white placeholder-gray-400 text-base leading-6 transition-all h-[50px]"
                disabled={isLoading}
                aria-label="検索キーワードを入力"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="group relative sm:w-auto w-full px-8 py-3 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-[50px] shadow-xl hover:shadow-2xl"
                aria-label={isLoading ? "検索中" : "画像を検索"}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </form>

        {/* エラー表示 */}
        {error && !isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">検索エラー</h3>
                <p className="text-red-50">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 画像グリッド */}
        {images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={image.urls.small}
                      alt={image.alt_description || image.description || "Unsplash image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium truncate">By {image.user.name}</p>
                      {image.likes > 0 && (
                        <p className="text-xs flex items-center gap-1 mt-1">
                          ❤️ {image.likes.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* もっと読み込むボタン */}
            {page < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all border border-white/30 disabled:opacity-50"
                >
                  {isLoading ? "読み込み中..." : "もっと見る"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 使い方ガイド */}
        {images.length === 0 && !error && !isLoading && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/30 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> 使い方
            </h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <span className="text-xl">1️⃣</span>
                <div>
                  <p className="font-semibold mb-1">キーワードを入力</p>
                  <p className="text-purple-100">
                    検索したいキーワードを英語で入力 (例: nature, cat, mountain)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="font-semibold mb-1">画像をクリック</p>
                  <p className="text-purple-100">画像をクリックすると拡大表示されます</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">3️⃣</span>
                <div>
                  <p className="font-semibold mb-1">もっと見る</p>
                  <p className="text-purple-100">
                    下部の「もっと見る」ボタンでさらに画像を読み込み
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm text-purple-100">
                  📷 画像は Unsplash API から提供されています
                </p>
              </div>
            </div>
          </div>
        )}

        {/* モーダル */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                aria-label="閉じる"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage.urls.regular}
                    alt={
                      selectedImage.alt_description || selectedImage.description || "Unsplash image"
                    }
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={selectedImage.user.profile_image.medium}
                      alt={selectedImage.user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold text-lg">{selectedImage.user.name}</p>
                      <p className="text-gray-600 text-sm">@{selectedImage.user.username}</p>
                    </div>
                    {selectedImage.likes > 0 && (
                      <div className="ml-auto flex items-center gap-2 text-red-500">
                        ❤️ <span className="font-bold">{selectedImage.likes.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  {(selectedImage.description || selectedImage.alt_description) && (
                    <p className="text-gray-700 mb-4">
                      {selectedImage.description || selectedImage.alt_description}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <a
                      href={selectedImage.urls.full}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all text-center"
                    >
                      元の画像を見る
                    </a>
                    {selectedImage.user.portfolio_url && (
                      <a
                        href={selectedImage.user.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all"
                      >
                        作者のページ
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
