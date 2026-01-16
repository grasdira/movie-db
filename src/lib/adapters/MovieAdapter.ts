import type { TMDBMovie, TMDBMovieListResponse } from '@/lib/api/types';
import type { Movie, MovieList } from '@/features/movies/types/movie';

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

/**
 * MovieAdapter 負責將 TMDB API 的資料格式轉換成應用程式內部使用的格式
 * 同時處理可能的資料異常情況
 */
export class MovieAdapter {
  /**
   * 將 TMDB 電影列表回應轉換為應用程式格式
   * 會過濾掉沒有 poster 的電影
   */
  static toMovieList(response: TMDBMovieListResponse): MovieList {
    const movies = response.results
      .filter((movie) => movie.poster_path !== null)
      .map((movie) => this.toMovie(movie));

    return {
      page: response.page,
      movies,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  /**
   * 將單一 TMDB 電影資料轉換為應用程式格式
   * 注意：這個方法假設 poster_path 不為 null
   */
  private static toMovie(movie: TMDBMovie): Movie {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
      originalLanguage: movie.original_language,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
    };
  }
}
