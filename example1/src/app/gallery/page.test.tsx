import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GalleryPage from "./page";

// fetch のモック
global.fetch = vi.fn();

// Next.js Image のモック
interface MockImageProps {
  fill?: boolean;
  alt?: string;
  [key: string]: unknown;
}

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    const { fill, alt = "", ...rest } = props;
    return <img {...rest} alt={alt} data-fill={fill ? "true" : "false"} />;
  },
}));

describe("Gallery Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示される", () => {
      render(<GalleryPage />);
      expect(screen.getByText("画像検索ギャラリー")).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      render(<GalleryPage />);
      expect(screen.getByText("Unsplashから美しい写真を検索")).toBeInTheDocument();
    });

    it("検索入力欄が表示される", () => {
      render(<GalleryPage />);
      const input = screen.getByPlaceholderText(/キーワードを入力/);
      expect(input).toBeInTheDocument();
    });

    it("検索ボタンが表示される", () => {
      render(<GalleryPage />);
      const button = screen.getByRole("button", { name: /画像を検索/ });
      expect(button).toBeInTheDocument();
    });

    it("空の入力では検索ボタンが無効", () => {
      render(<GalleryPage />);
      const button = screen.getByRole("button", { name: /画像を検索/ });
      expect(button).toBeDisabled();
    });

    it("使い方ガイドが表示される", () => {
      render(<GalleryPage />);
      expect(screen.getByText("使い方")).toBeInTheDocument();
    });
  });

  describe("検索機能", () => {
    it("キーワードを入力すると検索ボタンが有効になる", async () => {
      const user = userEvent.setup();
      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      expect(button).not.toBeDisabled();
    });

    it("検索成功時に画像が表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          images: [
            {
              id: "1",
              urls: {
                small: "https://example.com/image1-small.jpg",
                regular: "https://example.com/image1-regular.jpg",
                full: "https://example.com/image1-full.jpg",
              },
              alt_description: "Beautiful nature",
              description: "A beautiful nature photo",
              likes: 100,
              user: {
                name: "John Doe",
                username: "johndoe",
                profile_image: {
                  medium: "https://example.com/user1.jpg",
                },
                portfolio_url: "https://example.com/portfolio",
              },
            },
          ],
          total: 100,
          totalPages: 10,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByAltText("Beautiful nature")).toBeInTheDocument();
      });
    });

    it("検索失敗時にエラーが表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: false,
        error: "画像の取得に失敗しました",
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "test");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("検索エラー")).toBeInTheDocument();
      });

      expect(screen.getByText("画像の取得に失敗しました")).toBeInTheDocument();
    });

    it("ネットワークエラー時にエラーが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("予期しないエラーが発生しました")).toBeInTheDocument();
      });
    });
  });

  describe("ページネーション機能", () => {
    it("もっと見るボタンが表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          images: [
            {
              id: "1",
              urls: {
                small: "https://example.com/image1-small.jpg",
                regular: "https://example.com/image1-regular.jpg",
                full: "https://example.com/image1-full.jpg",
              },
              alt_description: "Image 1",
              likes: 10,
              user: {
                name: "User 1",
                username: "user1",
                profile_image: { medium: "https://example.com/user1.jpg" },
              },
            },
          ],
          total: 100,
          totalPages: 10,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /もっと見る/ })).toBeInTheDocument();
      });
    });

    it("もっと見るボタンで追加画像を読み込む", async () => {
      const user = userEvent.setup();
      const mockResponse1 = {
        success: true,
        data: {
          images: [
            {
              id: "1",
              urls: {
                small: "https://example.com/image1-small.jpg",
                regular: "https://example.com/image1-regular.jpg",
                full: "https://example.com/image1-full.jpg",
              },
              alt_description: "Image 1",
              likes: 10,
              user: {
                name: "User 1",
                username: "user1",
                profile_image: { medium: "https://example.com/user1.jpg" },
              },
            },
          ],
          total: 100,
          totalPages: 10,
        },
      };

      const mockResponse2 = {
        success: true,
        data: {
          images: [
            {
              id: "2",
              urls: {
                small: "https://example.com/image2-small.jpg",
                regular: "https://example.com/image2-regular.jpg",
                full: "https://example.com/image2-full.jpg",
              },
              alt_description: "Image 2",
              likes: 20,
              user: {
                name: "User 2",
                username: "user2",
                profile_image: { medium: "https://example.com/user2.jpg" },
              },
            },
          ],
          total: 100,
          totalPages: 10,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse1 })
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse2 });

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const searchButton = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByAltText("Image 1")).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole("button", { name: /もっと見る/ });
      await user.click(loadMoreButton);

      await waitFor(() => {
        expect(screen.getByAltText("Image 2")).toBeInTheDocument();
      });
    });
  });

  describe("ローディング状態", () => {
    it("検索中はローディング表示がされる", async () => {
      const user = userEvent.setup();

      let resolvePromise: (value: Response) => void;
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      render(<GalleryPage />);

      const input = screen.getByPlaceholderText(/キーワードを入力/);
      await user.type(input, "nature");

      const button = screen.getByRole("button", { name: /画像を検索/ });
      await user.click(button);

      // ローディング中のボタンテキストを確認
      await waitFor(() => {
        const loadingButton = screen.getByRole("button", { name: /検索中/ });
        expect(loadingButton).toBeInTheDocument();
      });

      // プロミスを解決してクリーンアップ
      if (resolvePromise) {
        resolvePromise({
          ok: true,
          json: async () => ({ success: true, data: { images: [], total: 0, totalPages: 0 } }),
        });
      }
    });
  });
});
