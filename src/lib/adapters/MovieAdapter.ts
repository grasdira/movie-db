import type { TMDBMovie, TMDBMovieListResponse } from '@/lib/api/types';
import type { Movie, SearchResult } from '@/features/movies/types/movie';

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

/**
 * MovieAdapter 負責將 TMDB API 的資料格式轉換成應用程式內部使用的格式
 * 同時處理可能的資料異常情況
 */
export class MovieAdapter {
  /**
   * 組合完整的圖片 URL
   * 支援不同尺寸以優化效能
   */
  private static getImageUrl(
    path: string | null,
    size: string = 'w500'
  ): string | null {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  /**
   * 將 TMDB 電影列表回應轉換為應用程式格式，適用於所有列表類 API
   */
  static toSearchResult(response: TMDBMovieListResponse): SearchResult {
    const movies = response.results.map((movie) => this.toMovie(movie));

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
      posterUrl: this.getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: this.getImageUrl(movie.backdrop_path, 'w1280'),
      originalLanguage: movie.original_language,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      originalTitle: movie.original_title,
      genreIds: movie.genre_ids,
    };
  }
}
