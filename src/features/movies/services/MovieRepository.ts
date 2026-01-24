import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieAdapter } from '@/lib/adapters/MovieAdapter';
import { MovieDetailAdapter } from '@/lib/adapters/MovieDetailAdapter';
import type {
  TMDBMovieListResponse,
  TMDBMovieDetailFull,
} from '@/lib/api/types';
import type { SearchResult, MovieDetail } from '@/features/movies/types/movie';

export class MovieRepository {
  static async getPopular(page: number = 1): Promise<SearchResult> {
    const response = await tmdbClient.getPopular(page);
    return MovieAdapter.toSearchResult(response as TMDBMovieListResponse);
  }

  static async getNowPlaying(page: number = 1): Promise<SearchResult> {
    const response = await tmdbClient.getNowPlaying(page);
    return MovieAdapter.toSearchResult(response as TMDBMovieListResponse);
  }

  static async getTopRated(page: number = 1): Promise<SearchResult> {
    const response = await tmdbClient.getTopRated(page);
    return MovieAdapter.toSearchResult(response as TMDBMovieListResponse);
  }

  static async getUpcoming(page: number = 1): Promise<SearchResult> {
    const response = await tmdbClient.getUpcoming(page);
    return MovieAdapter.toSearchResult(response as TMDBMovieListResponse);
  }

  /**
   * 獲取電影詳細資訊
   *
   * @param movieId - 電影 ID
   * @returns 完整的電影詳細資訊,包含演員、劇組、影片和評論
   */
  static async getMovieDetail(movieId: number): Promise<MovieDetail> {
    const response = await tmdbClient.getMovieDetail(movieId);
    return MovieDetailAdapter.toMovieDetail(response as TMDBMovieDetailFull);
  }

  /**
   * 搜尋電影
   *
   * 根據關鍵字搜尋電影,支援分頁載入
   *
   * @param query - 搜尋關鍵字
   * @param page - 頁碼 (預設為 1)
   * @returns 搜尋結果,包含電影列表和分頁資訊
   */
  static async searchMovies(
    query: string,
    page: number = 1
  ): Promise<SearchResult> {
    // 如果搜尋關鍵字為空,回傳空結果
    // 這避免了不必要的 API 呼叫
    if (!query || query.trim() === '') {
      return {
        page: 1,
        movies: [],
        totalPages: 0,
        totalResults: 0,
      };
    }

    const response = await tmdbClient.searchMovies(query.trim(), page);
    return MovieAdapter.toSearchResult(response as TMDBMovieListResponse);
  }
}
