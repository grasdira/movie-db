import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MovieAdapter } from './MovieAdapter';
import type { TMDBMovieListResponse } from '@/lib/api/types';

beforeEach(() => {
  vi.stubEnv('VITE_TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p');
});

describe('MovieAdapter', () => {
  describe('toMovieList', () => {
    // 測試 1: 空列表
    it('should return empty array when input is empty', () => {
      // 1. 建立一個 TMDBMovieListResponse 假資料，results 是空陣列
      const mockResponse: TMDBMovieListResponse = {
        page: 1,
        results: [], // 空陣列
        total_pages: 1,
        total_results: 0,
      };

      // 2. 呼叫 MovieAdapter.toMovieList()
      const result = MovieAdapter.toMovieList(mockResponse);

      // 3. 驗證回傳的 movies 陣列是空的
      expect(result.movies).toEqual([]);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalResults).toBe(0);
    });

    // 測試 2: 正常資料轉換
    it('should correctly transform movie data', () => {
      const mockResponse: TMDBMovieListResponse = {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: '/abc456.jpg',
            genre_ids: [16, 12, 10751, 14, 35],
            id: 123,
            original_language: 'en',
            original_title: 'Test Movie',
            overview: 'A Test Movie',
            popularity: 6572.614,
            poster_path: '/abc123.jpg',
            release_date: '2023-04-05',
            title: 'Test Movie',
            video: true,
            vote_average: 7.5,
            vote_count: 1456,
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      const result = MovieAdapter.toMovieList(mockResponse);

      // - movies 陣列長度是 1
      expect(result.movies).toHaveLength(1);
      // - 第一部電影的各個欄位是否正確轉換
      expect(result.movies[0].id).toBe(123);
      expect(result.movies[0].title).toBe('Test Movie');
      expect(result.movies[0].overview).toBe('A Test Movie');
      expect(result.movies[0].originalLanguage).toBe('en');
      expect(result.movies[0].releaseDate).toBe('2023-04-05');
      expect(result.movies[0].rating).toBe(7.5);
      expect(result.movies[0].voteCount).toBe(1456);
      // - posterUrl 是否正確組合
      expect(result.movies[0].posterUrl).toBe(
        'https://image.tmdb.org/t/p/w500/abc123.jpg'
      );
    });

    // 測試 3: 過濾 null poster
    it('should filter out movies without poster', () => {
      const mockResponse: TMDBMovieListResponse = {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: '/abc456.jpg',
            genre_ids: [16, 12, 10751, 14, 35],
            id: 123,
            original_language: 'en',
            original_title: 'Test Movie 1',
            overview: 'A Test Movie 1',
            popularity: 6572.614,
            poster_path: '/abc123.jpg',
            release_date: '2023-04-05',
            title: 'Test Movie 1',
            video: true,
            vote_average: 7.5,
            vote_count: 1456,
          },
          {
            adult: false,
            backdrop_path: '/abc321.jpg',
            genre_ids: [16, 14, 35],
            id: 456,
            original_language: 'en',
            original_title: 'Test Movie 2',
            overview: 'A Test Movie 2',
            popularity: 2358.9,
            poster_path: null,
            release_date: '2024-05-05',
            title: 'Test Movie 2',
            video: true,
            vote_average: 8.5,
            vote_count: 347,
          },
          {
            adult: false,
            backdrop_path: '/abc654.jpg',
            genre_ids: [14, 35],
            id: 789,
            original_language: 'en',
            original_title: 'Test Movie 3',
            overview: 'A Test Movie 3',
            popularity: 4236.614,
            poster_path: '/abc789.jpg',
            release_date: '2024-10-05',
            title: 'Test Movie 3',
            video: true,
            vote_average: 6.9,
            vote_count: 1998,
          },
        ],
        total_pages: 1,
        total_results: 3,
      };

      const result = MovieAdapter.toMovieList(mockResponse);

      // 驗證輸出只有 2 部電影
      expect(result.movies).toHaveLength(2);
    });

    // 測試 4: 分頁資訊傳遞
    it('should preserve pagination info', () => {
      const mockResponse: TMDBMovieListResponse = {
        page: 5,
        results: [
          {
            adult: false,
            backdrop_path: '/abc654.jpg',
            genre_ids: [14, 35],
            id: 789,
            original_language: 'en',
            original_title: 'Test Movie 3',
            overview: 'A Test Movie 3',
            popularity: 4236.614,
            poster_path: '/abc789.jpg',
            release_date: '2024-10-05',
            title: 'Test Movie 3',
            video: true,
            vote_average: 6.9,
            vote_count: 1998,
          },
        ],
        total_pages: 10,
        total_results: 200,
      };

      const result = MovieAdapter.toMovieList(mockResponse);

      expect(result.page).toBe(5);
      expect(result.totalPages).toBe(10);
      expect(result.totalResults).toBe(200);
      // 即使過濾後 movies 數量改變，分頁資訊仍保持 TMDB 原始值
    });
  });
});
