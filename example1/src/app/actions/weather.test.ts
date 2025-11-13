import { getWeather } from './weather';
import type { WeatherData } from '@/types/weather';

// fetch APIをモック
global.fetch = jest.fn();

describe('getWeather', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    // 環境変数を設定
    process.env.OPENWEATHER_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // 環境変数をクリア
    delete process.env.OPENWEATHER_API_KEY;
  });

  describe('入力バリデーション', () => {
    it('空の都市名の場合、エラーを返す', async () => {
      const result = await getWeather('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('都市名を入力してください');
      }
    });

    it('空白のみの都市名の場合、エラーを返す', async () => {
      const result = await getWeather('   ');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('都市名を入力してください');
      }
    });

    it('100文字を超える都市名の場合、エラーを返す', async () => {
      const longCityName = 'a'.repeat(101);
      const result = await getWeather(longCityName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('都市名が長すぎます');
      }
    });

    it('不正な文字を含む都市名の場合、エラーを返す', async () => {
      const result = await getWeather('Tokyo123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('都市名には英字、日本語、中国語、韓国語、スペース、カンマ、ハイフン、ピリオドのみ使用できます');
      }
    });

    it('有効な文字のみを含む都市名は許可される', async () => {
      // 成功レスポンスをモック
      const mockWeatherData: WeatherData = {
        coord: { lon: 139.6917, lat: 35.6895 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'JP',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1850144,
        name: 'Tokyo',
        cod: 200,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('Tokyo,JP');
      expect(result.success).toBe(true);
    });

    it('日本語の都市名（漢字・ひらがな・カタカナ）は英語に変換されて許可される', async () => {
      const mockWeatherData: WeatherData = {
        coord: { lon: 139.6917, lat: 35.6895 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'JP',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1850144,
        name: 'Tokyo',
        cod: 200,
      };

      // 漢字
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('東京');
      expect(result.success).toBe(true);
      // APIには英語名"Tokyo"が送信されることを確認
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=Tokyo'),
        expect.any(Object)
      );

      // ひらがな
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const resultHiragana = await getWeather('とうきょう');
      expect(resultHiragana.success).toBe(true);

      // カタカナ
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const resultKatakana = await getWeather('トウキョウ');
      expect(resultKatakana.success).toBe(true);
    });

    it('中国語の都市名（簡体字・繁体字）は英語に変換されて許可される', async () => {
      const mockWeatherData: WeatherData = {
        coord: { lon: 116.4074, lat: 39.9042 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 20,
          feels_like: 19,
          temp_min: 18,
          temp_max: 22,
          pressure: 1013,
          humidity: 50,
        },
        visibility: 10000,
        wind: {
          speed: 2.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'CN',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 28800,
        id: 1816670,
        name: 'Beijing',
        cod: 200,
      };

      // 簡体字
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('北京');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=Beijing'),
        expect.any(Object)
      );
    });

    it('韓国語の都市名（ハングル）は英語に変換されて許可される', async () => {
      const mockWeatherData: WeatherData = {
        coord: { lon: 126.9778, lat: 37.5683 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'KR',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1835848,
        name: 'Seoul',
        cod: 200,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('서울');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=Seoul'),
        expect.any(Object)
      );
    });
  });

  describe('API キーの検証', () => {
    it('API キーが設定されていない場合、エラーを返す', async () => {
      delete process.env.OPENWEATHER_API_KEY;
      const result = await getWeather('Tokyo');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('API キーが設定されていません。環境変数 OPENWEATHER_API_KEY を設定してください。');
      }
    });
  });

  describe('API レスポンスの処理', () => {
    it('正常なAPIレスポンスの場合、天気データを返す', async () => {
      const mockWeatherData: WeatherData = {
        coord: { lon: 139.6917, lat: 35.6895 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.3,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'JP',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1850144,
        name: 'Tokyo',
        cod: 200,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('Tokyo');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.city).toBe('Tokyo');
        expect(result.data.country).toBe('JP');
        expect(result.data.temperature).toBe(16); // Math.round(15.5)
        expect(result.data.feelsLike).toBe(14); // Math.round(14.3)
        expect(result.data.description).toBe('晴れ');
        expect(result.data.humidity).toBe(60);
        expect(result.data.windSpeed).toBe(3.5);
        expect(result.data.icon).toBe('01d');
        expect(result.data.timestamp).toBe(1699776000);
        expect(result.data.timezone).toBe(32400);
      }
    });

    it('API エラーレスポンスの場合、エラーメッセージを返す', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          cod: '404',
          message: 'city not found',
        }),
      });

      const result = await getWeather('InvalidCity');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('city not found');
      }
    });

    it('ネットワークエラーの場合、エラーメッセージを返す', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getWeather('Tokyo');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
      }
    });

    it('天気データの配列が空の場合、エラーを返す', async () => {
      const mockWeatherData = {
        coord: { lon: 139.6917, lat: 35.6895 },
        weather: [], // 空の配列
        base: 'stations',
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'JP',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1850144,
        name: 'Tokyo',
        cod: 200,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getWeather('Tokyo');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('天気データが不完全です');
      }
    });
  });

  describe('URLパラメータの構築', () => {
    it('URLSearchParamsを使用して安全にパラメータを構築する', async () => {
      const mockWeatherData: WeatherData = {
        coord: { lon: 139.6917, lat: 35.6895 },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: '晴れ',
            icon: '01d',
          },
        ],
        base: 'stations',
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: {
          speed: 3.5,
          deg: 180,
        },
        clouds: {
          all: 0,
        },
        dt: 1699776000,
        sys: {
          country: 'JP',
          sunrise: 1699740000,
          sunset: 1699776000,
        },
        timezone: 32400,
        id: 1850144,
        name: 'Tokyo',
        cod: 200,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      await getWeather('Tokyo');

      // fetchが正しいURLで呼ばれたか確認
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.openweathermap.org/data/2.5/weather?'),
        expect.objectContaining({
          cache: 'no-store',
        })
      );

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('q=Tokyo');
      expect(callUrl).toContain('appid=test-api-key');
      expect(callUrl).toContain('units=metric');
      expect(callUrl).toContain('lang=ja');
    });
  });
});
