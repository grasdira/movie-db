import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieAdapter } from '@/lib/adapters/MovieAdapter';
import type { TMDBMovieListResponse } from '@/lib/api/types';
import type { SearchResult } from '@/features/movies/types/movie';

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
}
