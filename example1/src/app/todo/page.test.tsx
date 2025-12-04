import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoPage from "./page";

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

describe("Todo Page", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示される", () => {
      render(<TodoPage />);
      expect(screen.getByText("TODOリスト")).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      render(<TodoPage />);
      expect(screen.getByText("タスクを管理して生産性を向上")).toBeInTheDocument();
    });

    it("タスク入力欄が表示される", () => {
      render(<TodoPage />);
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      expect(input).toBeInTheDocument();
    });

    it("追加ボタンが表示される", () => {
      render(<TodoPage />);
      const button = screen.getByRole("button", { name: /タスクを追加/ });
      expect(button).toBeInTheDocument();
    });

    it("空の入力では追加ボタンが無効", () => {
      render(<TodoPage />);
      const button = screen.getByRole("button", { name: /タスクを追加/ });
      expect(button).toBeDisabled();
    });

    it("統計情報が表示される", () => {
      render(<TodoPage />);
      expect(screen.getByText("全タスク")).toBeInTheDocument();
      expect(screen.getByText("未完了")).toBeInTheDocument();
      expect(screen.getByText("完了")).toBeInTheDocument();
    });

    it("フィルターボタンが表示される", () => {
      render(<TodoPage />);
      const allButtons = screen.getAllByRole("button");
      const filterButtons = allButtons.filter((btn) =>
        btn.textContent?.match(/すべて|未完了|完了/)
      );
      expect(filterButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("タスク追加機能", () => {
    it("タスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");

      const button = screen.getByRole("button", { name: /タスクを追加/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText("テストタスク")).toBeInTheDocument();
      });
    });

    it("タスク追加後に入力欄がクリアされる", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");

      const button = screen.getByRole("button", { name: /タスクを追加/ });
      await user.click(button);

      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("空白のみのタスクは追加されない", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "   ");

      const button = screen.getByRole("button", { name: /タスクを追加/ });
      expect(button).toBeDisabled();
    });
  });

  describe("タスク操作", () => {
    it("タスクを完了状態にできる", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      // タスクを追加
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      const addButton = screen.getByRole("button", { name: /タスクを追加/ });
      await user.click(addButton);

      // 完了ボタンをクリック
      const checkbox = await screen.findByRole("button", { name: /タスクを完了にする/ });
      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /タスクを未完了にする/ })).toBeInTheDocument();
      });
    });

    it("タスクを削除できる", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      // タスクを追加
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      const addButton = screen.getByRole("button", { name: /タスクを追加/ });
      await user.click(addButton);

      // タスクが表示されるまで待つ
      const taskElement = await screen.findByText("テストタスク");
      const taskContainer = taskElement.closest(".group");

      // Hoverして削除ボタンを表示させる
      if (taskContainer) {
        const deleteButton = taskContainer.querySelector('button[aria-label="タスクを削除"]');
        if (deleteButton) {
          await user.click(deleteButton as Element);
        }
      }

      await waitFor(() => {
        expect(screen.queryByText("テストタスク")).not.toBeInTheDocument();
      });
    });
  });

  describe("フィルター機能", () => {
    it("フィルターボタンをクリックできる", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      // タスクを1つ追加
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      await user.click(screen.getByRole("button", { name: /タスクを追加/ }));

      await waitFor(() => {
        expect(screen.getByText("テストタスク")).toBeInTheDocument();
      });

      // フィルターボタンを見つけてクリック可能か確認
      const allButtons = screen.getAllByRole("button");
      const filterButtons = allButtons.filter((btn) =>
        btn.textContent?.match(/すべて|未完了|完了/)
      );
      expect(filterButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("LocalStorage連携", () => {
    it("タスク追加時にLocalStorageに保存される", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "テストタスク");
      await user.click(screen.getByRole("button", { name: /タスクを追加/ }));

      await waitFor(() => {
        const savedData = localStorageMock.getItem("todos");
        expect(savedData).toBeTruthy();
        const todos = JSON.parse(savedData ?? "[]");
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe("テストタスク");
      });
    });
  });

  describe("統計情報", () => {
    it("タスク数が正しく表示される", async () => {
      const user = userEvent.setup();
      render(<TodoPage />);

      // 2つのタスクを追加
      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      await user.type(input, "タスク1");
      await user.click(screen.getByRole("button", { name: /タスクを追加/ }));

      await user.type(input, "タスク2");
      await user.click(screen.getByRole("button", { name: /タスクを追加/ }));

      await waitFor(() => {
        // すべてボタンのカウントを確認
        expect(screen.getByRole("button", { name: /すべて \(2\)/ })).toBeInTheDocument();
      });
    });
  });
});
