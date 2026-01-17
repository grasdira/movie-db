/**
 * 應用程式內部使用的電影資料型別
 */
export interface Movie {
  id: number;
  title: string;
  originalLanguage: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
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
