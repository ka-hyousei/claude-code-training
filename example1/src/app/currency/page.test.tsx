import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyPage from './page';

// fetch のモック
global.fetch = jest.fn();

describe('Currency Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期表示', () => {
    it('ページタイトルが表示される', () => {
      render(<CurrencyPage />);
      expect(screen.getByText('通貨換算ツール')).toBeInTheDocument();
    });

    it('説明文が表示される', () => {
      render(<CurrencyPage />);
      expect(screen.getByText('リアルタイムの為替レートで通貨を換算')).toBeInTheDocument();
    });

    it('金額入力欄が表示される', () => {
      render(<CurrencyPage />);
      const input = screen.getByLabelText('金額');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(100);
    });

    it('基準通貨選択が表示される', () => {
      render(<CurrencyPage />);
      const select = screen.getByLabelText('基準通貨');
      expect(select).toBeInTheDocument();
    });

    it('換算ボタンが表示される', () => {
      render(<CurrencyPage />);
      const button = screen.getByRole('button', { name: /通貨を換算/ });
      expect(button).toBeInTheDocument();
    });

    it('デフォルト値でボタンが有効', () => {
      render(<CurrencyPage />);
      const button = screen.getByRole('button', { name: /通貨を換算/ });
      expect(button).not.toBeDisabled();
    });
  });

  describe('換算機能', () => {
    it('換算成功時に結果が表示される', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          baseCurrency: 'USD',
          baseAmount: 100,
          conversions: [
            {
              currency: 'JPY',
              rate: 150.5,
              amount: 15050,
              symbol: '¥',
              name: '日本円',
            },
            {
              currency: 'EUR',
              rate: 0.92,
              amount: 92,
              symbol: '€',
              name: 'ユーロ',
            },
          ],
          lastUpdated: '2024-01-01T00:00:00Z',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<CurrencyPage />);

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('換算元')).toBeInTheDocument();
      });

      expect(screen.getAllByText(/日本円/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/ユーロ/).length).toBeGreaterThan(0);
    });

    it('金額を変更して換算できる', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          baseCurrency: 'USD',
          baseAmount: 200,
          conversions: [],
          lastUpdated: '2024-01-01T00:00:00Z',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<CurrencyPage />);

      const input = screen.getByLabelText('金額');
      await user.clear(input);
      await user.type(input, '200');

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('amount=200')
        );
      });
    });

    it('基準通貨を変更して換算できる', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          baseCurrency: 'JPY',
          baseAmount: 100,
          conversions: [],
          lastUpdated: '2024-01-01T00:00:00Z',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<CurrencyPage />);

      const select = screen.getByLabelText('基準通貨');
      await user.selectOptions(select, 'JPY');

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('from=JPY')
        );
      });
    });

    it('換算失敗時にエラーが表示される', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: false,
        error: '為替レートの取得に失敗しました',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<CurrencyPage />);

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('換算エラー')).toBeInTheDocument();
      });

      expect(screen.getByText('為替レートの取得に失敗しました')).toBeInTheDocument();
    });

    it('ネットワークエラー時にエラーが表示される', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<CurrencyPage />);

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('予期しないエラーが発生しました')).toBeInTheDocument();
      });
    });
  });

  describe('バリデーション', () => {
    it('金額が0以下の場合、ボタンが無効になる', async () => {
      const user = userEvent.setup();
      render(<CurrencyPage />);

      const input = screen.getByLabelText('金額');
      await user.clear(input);
      await user.type(input, '0');

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      expect(button).toBeDisabled();
    });

    it('金額が空の場合、ボタンが無効になる', async () => {
      const user = userEvent.setup();
      render(<CurrencyPage />);

      const input = screen.getByLabelText('金額');
      await user.clear(input);

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      expect(button).toBeDisabled();
    });
  });

  describe('使い方ガイド', () => {
    it('初期状態で使い方が表示される', () => {
      render(<CurrencyPage />);
      expect(screen.getByText('使い方')).toBeInTheDocument();
      expect(screen.getByText('金額を入力')).toBeInTheDocument();
      expect(screen.getByText('基準通貨を選択')).toBeInTheDocument();
    });
  });

  describe('ローディング状態', () => {
    it('換算中はローディング表示がされる', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<CurrencyPage />);

      const button = screen.getByRole('button', { name: /通貨を換算/ });
      await user.click(button);

      expect(screen.getByText('換算中...')).toBeInTheDocument();
    });
  });
});
