import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// react-markdownをモック
vi.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

vi.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => {},
}));

vi.mock("rehype-highlight", () => ({
  __esModule: true,
  default: () => {},
}));

import MarkdownPage from "./page";

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

// URL.createObjectURL のモック
global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = vi.fn();

// confirm のモック
global.confirm = vi.fn(() => true);

describe("Markdown Page", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByText("Markdownエディター")).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByText("リアルタイムプレビュー機能付き")).toBeInTheDocument();
    });

    it("エディターセクションが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByText("編集")).toBeInTheDocument();
    });

    it("プレビューセクションが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByText("プレビュー")).toBeInTheDocument();
    });

    it("エクスポートボタンが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByRole("button", { name: /エクスポート/ })).toBeInTheDocument();
    });

    it("リセットボタンが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByRole("button", { name: /リセット/ })).toBeInTheDocument();
    });

    it("クリアボタンが表示される", () => {
      render(<MarkdownPage />);
      expect(screen.getByRole("button", { name: /クリア/ })).toBeInTheDocument();
    });

    it("デフォルトのMarkdownテキストが表示される", () => {
      render(<MarkdownPage />);
      const elements = screen.getAllByText(/Markdownエディターへようこそ/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe("エディター機能", () => {
    it("テキストを入力できる", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "# テスト見出し");

      expect(textarea).toHaveValue("# テスト見出し");
    });

    it("入力したテキストがプレビューに反映される", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "test-heading");

      await waitFor(() => {
        // モックされたreact-markdownは単純にテキストを表示するだけ
        const elements = screen.getAllByText("test-heading");
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it("文字数と行数が表示される", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "test");

      await waitFor(() => {
        expect(screen.getByText(/4 文字/)).toBeInTheDocument();
        expect(screen.getByText(/1 行/)).toBeInTheDocument();
      });
    });
  });

  describe("ボタン機能", () => {
    it("クリアボタンでテキストがクリアされる", async () => {
      const user = userEvent.setup();
      (global.confirm as ReturnType<typeof vi.fn>).mockReturnValue(true);

      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "テストテキスト");

      const clearButton = screen.getByRole("button", { name: /クリア/ });
      await user.click(clearButton);

      expect(global.confirm).toHaveBeenCalledWith(
        "本当にすべてクリアしますか？この操作は元に戻せません。"
      );
      expect(textarea).toHaveValue("");
    });

    it("クリア確認でキャンセルした場合はクリアされない", async () => {
      const user = userEvent.setup();
      (global.confirm as ReturnType<typeof vi.fn>).mockReturnValue(false);

      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "テストテキスト");

      const clearButton = screen.getByRole("button", { name: /クリア/ });
      await user.click(clearButton);

      expect(textarea).toHaveValue("テストテキスト");
    });

    it("リセットボタンでデフォルトテキストに戻る", async () => {
      const user = userEvent.setup();
      (global.confirm as ReturnType<typeof vi.fn>).mockReturnValue(true);

      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "カスタムテキスト");

      const resetButton = screen.getByRole("button", { name: /リセット/ });
      await user.click(resetButton);

      expect(global.confirm).toHaveBeenCalled();
      await waitFor(() => {
        expect(textarea.value).toContain("Markdownエディターへようこそ");
      });
    });

    it("エクスポートボタンでファイルがダウンロードされる", async () => {
      const user = userEvent.setup();
      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      render(<MarkdownPage />);

      const exportButton = screen.getByRole("button", { name: /エクスポート/ });
      await user.click(exportButton);

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe("LocalStorage連携", () => {
    it("テキスト変更時にLocalStorageに保存される", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "# テスト");

      await waitFor(() => {
        const savedData = localStorageMock.getItem("markdown");
        expect(savedData).toBe("# テスト");
      });
    });

    it("LocalStorageから保存データを読み込む", () => {
      localStorageMock.setItem("markdown", "# 保存されたテキスト");

      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      expect(textarea).toHaveValue("# 保存されたテキスト");
    });

    it("LocalStorageにデータがない場合はデフォルトテキストを表示", () => {
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      expect(textarea.value).toContain("Markdownエディターへようこそ");
    });
  });

  describe("Markdownレンダリング", () => {
    it("Markdownテキストがプレビューに反映される", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);
      await user.type(textarea, "heading-test");

      await waitFor(() => {
        const elements = screen.getAllByText("heading-test");
        // テキストエリアとプレビューの両方に表示されるので2つ以上
        expect(elements.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("空のテキストの場合はプレースホルダーが表示される", async () => {
      const user = userEvent.setup();
      render(<MarkdownPage />);

      const textarea = screen.getByPlaceholderText("ここにMarkdownを入力...");
      await user.clear(textarea);

      await waitFor(() => {
        // モックしたreact-markdownは単純にテキストを表示するだけなので、空の場合もプレースホルダーテキストが表示される
        const preview = screen.getByText(/プレビューがここに表示されます/);
        expect(preview).toBeInTheDocument();
      });
    });
  });
});
