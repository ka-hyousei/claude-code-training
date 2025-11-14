export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  created_at: string;
  width: number;
  height: number;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface ImageGalleryApiResponse {
  success: boolean;
  data?: {
    images: UnsplashImage[];
    total: number;
    totalPages: number;
  };
  error?: string;
}
