// 列出會使用到的 TMDB API 所回應的資料結構

/**
 * TMDB API 回傳的基本電影資料
 * 適用於所有列表類 API
 */
export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * 列表類 API 的通用回應結構
 * 適用於：popular(https://developer.themoviedb.org/reference/movie-popular-list), top_rated(https://developer.themoviedb.org/reference/movie-top-rated-list), discover(https://developer.themoviedb.org/reference/discover-movie), search(https://developer.themoviedb.org/reference/search-movie)
 */
export interface TMDBMovieListResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

/**
 * 帶有日期範圍的列表回應
 * 適用於：now_playing(https://developer.themoviedb.org/reference/movie-now-playing-list), upcoming(https://developer.themoviedb.org/reference/movie-upcoming-list)
 */
export interface TMDBMovieListResponseWithDates extends TMDBMovieListResponse {
  dates: {
    maximum: string;
    minimum: string;
  };
}

/**
 * 電影詳情 API 的回應結構
 * https://developer.themoviedb.org/reference/movie-details
 */
export interface TMDBMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: string | null;
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * Credits API 的回應結構
 * https://developer.themoviedb.org/reference/movie-credits
 */
export interface TMDBCredits {
  cast: Array<{
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }>;
  crew: Array<{
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
  }>;
}

/**
 * Videos API 的回應結構
 * https://developer.themoviedb.org/reference/movie-videos
 */
export interface TMDBVideos {
  results: Array<{
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
  }>;
}

/**
 * Reviews API 的回應結構
 * https://developer.themoviedb.org/reference/movie-reviews
 */
export interface TMDBReviews {
  id: number;
  page: number;
  results: Array<{
    id: string;
    author: string;
    author_details: {
      name: string;
      username: string;
      avatar_path: string | null;
      rating: number | null;
    };
    content: string;
    created_at: string;
    updated_at: string;
    url: string;
  }>;
  total_pages: number;
  total_results: number;
}

/**
 * 在電影詳情 API 中使用 append_to_response 獲取完整電影詳情
 * https://developer.themoviedb.org/reference/movie-details
 */
export interface TMDBMovieDetailFull extends TMDBMovieDetail {
  credits?: TMDBCredits;
  videos?: TMDBVideos;
  reviews?: TMDBReviews;
}
