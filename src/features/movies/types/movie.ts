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
  popularity: number;
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

/**
 * 電影類型(Genre)
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * 演員資訊
 */
export interface Cast {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

/**
 * 劇組人員資訊
 */
export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

/**
 * 影片/預告片資訊
 */
export interface Video {
  id: string;
  key: string; // YouTube video key
  name: string;
  site: string; // e.g., "YouTube"
  type: string; // e.g., "Trailer", "Teaser"
  official: boolean;
}

/**
 * 評論資訊
 */
export interface Review {
  id: string;
  author: string;
  authorUsername: string;
  avatarUrl: string | null;
  rating: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 完整的電影詳細資訊
 * 包含基本資訊、演員陣容、影片和評論
 */
export interface MovieDetail extends Omit<Movie, 'genreIds'> {
  tagline: string | null;
  runtime: number | null; // 片長(分鐘)
  budget: number;
  revenue: number;
  status: string; // e.g., "Released", "Post Production"
  genres: Genre[];

  // 額外資訊
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  reviews: Review[];
}
