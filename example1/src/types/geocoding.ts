// ジオコーディングAPIのレスポンス型
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
  addressComponents: AddressComponent[];
}

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

// APIレスポンスの型
export interface GeocodingApiResponse {
  success: boolean;
  data?: GeocodingResult;
  error?: string;
}

// 検索履歴の型
export interface SearchHistory {
  id: string;
  address: string;
  result: GeocodingResult;
  timestamp: number;
}
