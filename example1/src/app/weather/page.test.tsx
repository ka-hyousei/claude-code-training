import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherPage from './page';
import { getWeather } from '@/app/actions/weather';

// Server Action のモック
vi.mock('@/app/actions/weather', () => ({
  getWeather: vi.fn(),
}));

describe('Weather Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期表示', () => {
    it('ページタイトルが表示される', () => {
      render(<WeatherPage />);
      expect(screen.getByText('天気予報')).toBeInTheDocument();
    });

    it('説明文が表示される', () => {
      render(<WeatherPage />);
      expect(screen.getByText('世界中の天気を多言語で検索')).toBeInTheDocument();
    });

    it('都市名入力欄が表示される', () => {
      render(<WeatherPage />);
      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      expect(input).toBeInTheDocument();
    });

    it('検索ボタンが表示される', () => {
      render(<WeatherPage />);
      const button = screen.getByRole('button', { name: /天気を検索/ });
      expect(button).toBeInTheDocument();
    });

    it('空の入力では検索ボタンが無効', () => {
      render(<WeatherPage />);
      const button = screen.getByRole('button', { name: /天気を検索/ });
      expect(button).toBeDisabled();
    });

    it('対応言語が表示される', () => {
      render(<WeatherPage />);
      const languageTags = screen.getAllByText(/日本語|中文|한국어|English/);
      expect(languageTags.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('検索機能', () => {
    it('都市名を入力すると検索ボタンが有効になる', async () => {
      const user = userEvent.setup();
      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'Tokyo');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      expect(button).not.toBeDisabled();
    });

    it('検索成功時に天気情報が表示される', async () => {
      const user = userEvent.setup();
      const mockWeather = {
        success: true,
        data: {
          city: 'Tokyo',
          country: 'JP',
          temperature: 20,
          description: 'clear sky',
          icon: '01d',
          feelsLike: 19,
          humidity: 60,
          windSpeed: 3.5,
          timestamp: 1609459200,
          timezone: 32400,
        },
      };

      (getWeather as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockWeather);

      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'Tokyo');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
      });

      expect(screen.getByText('JP')).toBeInTheDocument();
      expect(screen.getByText(/20°C/)).toBeInTheDocument();
      expect(screen.getByText(/19°C/)).toBeInTheDocument(); // 体感温度
      expect(screen.getByText(/60%/)).toBeInTheDocument(); // 湿度
      expect(screen.getByText(/3.5 m\/s/)).toBeInTheDocument(); // 風速
    });

    it('検索失敗時にエラーが表示される', async () => {
      const user = userEvent.setup();
      const mockError = {
        success: false,
        error: '都市が見つかりませんでした',
      };

      (getWeather as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockError);

      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'InvalidCity');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('検索エラー')).toBeInTheDocument();
      });

      expect(screen.getByText('都市が見つかりませんでした')).toBeInTheDocument();
    });

    it('例外発生時にエラーが表示される', async () => {
      const user = userEvent.setup();

      (getWeather as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'Tokyo');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('予期しないエラーが発生しました')).toBeInTheDocument();
      });
    });
  });

  describe('エラーメッセージ表示', () => {
    it('エラー時に解決方法が表示される', async () => {
      const user = userEvent.setup();
      const mockError = {
        success: false,
        error: '都市が見つかりませんでした',
      };

      (getWeather as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockError);

      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'InvalidCity');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('解決方法')).toBeInTheDocument();
      });

      expect(screen.getByText(/都市名のスペルを確認してください/)).toBeInTheDocument();
    });
  });

  describe('ローディング状態', () => {
    it('検索中はローディング表示がされる', async () => {
      const user = userEvent.setup();

      (getWeather as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 100))
      );

      render(<WeatherPage />);

      const input = screen.getByPlaceholderText(/例: 東京, 北京, Seoul, London/);
      await user.type(input, 'Tokyo');

      const button = screen.getByRole('button', { name: /天気を検索/ });
      await user.click(button);

      expect(screen.getByText('検索中...')).toBeInTheDocument();
      expect(screen.getByText('天気情報を取得中...')).toBeInTheDocument();
    });
  });

  describe('使い方ガイド', () => {
    it('初期状態で使い方が表示される', () => {
      render(<WeatherPage />);
      expect(screen.getByText('使い方')).toBeInTheDocument();
      expect(screen.getByText('多言語対応')).toBeInTheDocument();
      expect(screen.getByText('入力例')).toBeInTheDocument();
    });
  });
});
