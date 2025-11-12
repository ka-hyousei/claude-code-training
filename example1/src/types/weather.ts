// OpenWeatherMap APIのレスポンス型定義

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherError {
  cod: string | number;
  message: string;
}

export type WeatherResponse = WeatherData | WeatherError;

// 型ガード関数
export function isWeatherError(data: WeatherResponse): data is WeatherError {
  return 'message' in data && typeof data.message === 'string' && !('weather' in data);
}

export function isWeatherData(data: WeatherResponse): data is WeatherData {
  return 'weather' in data && Array.isArray(data.weather);
}

// 天気情報の表示用型
export interface WeatherDisplay {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: number; // UNIXタイムスタンプ
  timezone: number; // タイムゾーンオフセット（秒）
}
