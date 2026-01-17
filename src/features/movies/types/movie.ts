/**
 * 應用程式內部使用的電影資料型別
 */
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genreIds?: number[];
}

/**
 * 搜尋結果的分頁資訊
 */
export interface SearchResult {
  page: number;
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}

/**
 * 電影分類類型
 * 對應 TMDB API 的不同電影列表端點
 */
export type MovieCategory = 'popular' | 'nowPlaying' | 'topRated' | 'upcoming';
