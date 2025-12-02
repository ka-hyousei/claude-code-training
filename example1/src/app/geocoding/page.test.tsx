import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GeocodingPage from "./page";

// LocalStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// fetch のモック
global.fetch = vi.fn();

describe("Geocoding Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示される", () => {
      render(<GeocodingPage />);
      expect(screen.getByText("ジオコーディング検索")).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      render(<GeocodingPage />);
      expect(screen.getByText("住所から緯度経度を取得して地図表示")).toBeInTheDocument();
    });

    it("住所入力欄が表示される", () => {
      render(<GeocodingPage />);
      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      expect(input).toBeInTheDocument();
    });

    it("検索ボタンが表示される", () => {
      render(<GeocodingPage />);
      const button = screen.getByRole("button", { name: /住所を検索/ });
      expect(button).toBeInTheDocument();
    });

    it("空の入力では検索ボタンが無効", () => {
      render(<GeocodingPage />);
      const button = screen.getByRole("button", { name: /住所を検索/ });
      expect(button).toBeDisabled();
    });

    it("使い方ガイドが表示される", () => {
      render(<GeocodingPage />);
      expect(screen.getByText("使い方")).toBeInTheDocument();
    });
  });

  describe("検索機能", () => {
    it("住所を入力すると検索ボタンが有効になる", async () => {
      const user = userEvent.setup();
      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "東京都");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      expect(button).not.toBeDisabled();
    });

    it("検索成功時に結果が表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          lat: 35.6812,
          lng: 139.7671,
          formattedAddress: "日本、東京都",
          placeId: "test-place-id",
          addressComponents: [],
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "東京都");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("検索結果")).toBeInTheDocument();
      });

      expect(screen.getByText("日本、東京都")).toBeInTheDocument();
      expect(screen.getByText("35.681200")).toBeInTheDocument();
      expect(screen.getByText("139.767100")).toBeInTheDocument();
    });

    it("検索失敗時にエラーが表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: false,
        error: "住所が見つかりませんでした",
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "無効な住所");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("検索エラー")).toBeInTheDocument();
      });

      expect(screen.getByText("住所が見つかりませんでした")).toBeInTheDocument();
    });

    it("ネットワークエラー時にエラーが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "東京都");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("予期しないエラーが発生しました")).toBeInTheDocument();
      });
    });
  });

  describe("検索履歴機能", () => {
    it("検索履歴セクションが表示される", () => {
      render(<GeocodingPage />);
      expect(screen.getAllByText("検索履歴").length).toBeGreaterThan(0);
    });

    it("初期状態では履歴が空", () => {
      render(<GeocodingPage />);
      expect(screen.getByText("検索履歴はまだありません")).toBeInTheDocument();
    });

    it("検索成功時にLocalStorageに保存される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          lat: 35.6812,
          lng: 139.7671,
          formattedAddress: "日本、東京都",
          placeId: "test-place-id",
          addressComponents: [],
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "東京都");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      await user.click(button);

      await waitFor(() => {
        const savedData = localStorageMock.getItem("geocoding_history");
        expect(savedData).toBeTruthy();
      });
    });
  });

  describe("ローディング状態", () => {
    it("検索中はローディング状態が表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<GeocodingPage />);

      const input = screen.getByPlaceholderText(/例: 東京都渋谷区渋谷/);
      await user.type(input, "東京都");

      const button = screen.getByRole("button", { name: /住所を検索/ });
      await user.click(button);

      expect(screen.getByText("検索中...")).toBeInTheDocument();
    });
  });
});
