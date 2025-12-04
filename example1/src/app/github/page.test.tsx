import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GitHubPage from "./page";

// fetch のモック
global.fetch = vi.fn();

describe("GitHub Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示される", () => {
      render(<GitHubPage />);
      expect(screen.getByText("GitHub ユーザー検索")).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      render(<GitHubPage />);
      expect(
        screen.getByText("GitHubユーザーのプロフィールとリポジトリを検索")
      ).toBeInTheDocument();
    });

    it("ユーザー名入力欄が表示される", () => {
      render(<GitHubPage />);
      const input = screen.getByPlaceholderText(/例: octocat/);
      expect(input).toBeInTheDocument();
    });

    it("検索ボタンが表示される", () => {
      render(<GitHubPage />);
      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      expect(button).toBeInTheDocument();
    });

    it("空の入力では検索ボタンが無効", () => {
      render(<GitHubPage />);
      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      expect(button).toBeDisabled();
    });

    it("使い方ガイドが表示される", () => {
      render(<GitHubPage />);
      expect(screen.getByText("使い方")).toBeInTheDocument();
    });
  });

  describe("検索機能", () => {
    it("ユーザー名を入力すると検索ボタンが有効になる", async () => {
      const user = userEvent.setup();
      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "octocat");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      expect(button).not.toBeDisabled();
    });

    it("検索成功時にユーザー情報が表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          user: {
            login: "octocat",
            name: "The Octocat",
            avatar_url: "https://avatars.githubusercontent.com/u/583231",
            bio: "GitHub mascot",
            html_url: "https://github.com/octocat",
            public_repos: 8,
            followers: 5000,
            following: 10,
            public_gists: 5,
            company: "@github",
            location: "San Francisco",
            blog: "https://github.blog",
            twitter_username: null,
          },
          repositories: [
            {
              id: 1,
              name: "Hello-World",
              description: "My first repository",
              html_url: "https://github.com/octocat/Hello-World",
              language: "JavaScript",
              stargazers_count: 100,
              forks_count: 50,
              updated_at: "2024-01-01T00:00:00Z",
              topics: ["hello", "world"],
              fork: false,
            },
          ],
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "octocat");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("The Octocat")).toBeInTheDocument();
      });

      expect(screen.getByText("@octocat")).toBeInTheDocument();
      expect(screen.getByText("GitHub mascot")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument(); // リポジトリ数
      expect(screen.getByText("5,000")).toBeInTheDocument(); // フォロワー数
    });

    it("リポジトリ一覧が表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          user: {
            login: "octocat",
            name: "The Octocat",
            avatar_url: "https://avatars.githubusercontent.com/u/583231",
            html_url: "https://github.com/octocat",
            public_repos: 1,
            followers: 100,
            following: 10,
            public_gists: 5,
          },
          repositories: [
            {
              id: 1,
              name: "Hello-World",
              description: "My first repository",
              html_url: "https://github.com/octocat/Hello-World",
              language: "JavaScript",
              stargazers_count: 100,
              forks_count: 50,
              updated_at: "2024-01-01T00:00:00Z",
              topics: ["hello", "world"],
              fork: false,
            },
          ],
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "octocat");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("最近更新されたリポジトリ")).toBeInTheDocument();
      });

      expect(screen.getByText("Hello-World")).toBeInTheDocument();
      expect(screen.getByText("My first repository")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });

    it("検索失敗時にエラーが表示される", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: false,
        error: "ユーザーが見つかりませんでした",
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "nonexistentuser12345");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("検索エラー")).toBeInTheDocument();
      });

      expect(screen.getByText("ユーザーが見つかりませんでした")).toBeInTheDocument();
    });

    it("ネットワークエラー時にエラーが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "octocat");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("予期しないエラーが発生しました")).toBeInTheDocument();
      });
    });
  });

  describe("ローディング状態", () => {
    it("検索中はローディング表示がされる", async () => {
      const user = userEvent.setup();

      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<GitHubPage />);

      const input = screen.getByPlaceholderText(/例: octocat/);
      await user.type(input, "octocat");

      const button = screen.getByRole("button", { name: /ユーザーを検索/ });
      await user.click(button);

      expect(screen.getByText("検索中...")).toBeInTheDocument();
    });
  });
});
