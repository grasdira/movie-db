import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tmdbClient, APIError } from './tmdbClient';

// 設定 mock 環境變數
beforeEach(() => {
  vi.stubEnv('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3');

  vi.clearAllMocks(); // 清理之前的 mock
});

describe('tmdbClient', () => {
  // 用 getNowPlaying 完整測試
  describe('getNowPlaying', () => {
    it('should fetch with correct URL and headers', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], page: 1 }),
      });
      globalThis.fetch = mockFetch;

      await tmdbClient.getNowPlaying(1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US'
      );

      // 驗證 Authorization header 的格式，而不是具體的值
      expect(options.headers.Authorization).toMatch(/^Bearer .+$/);
      expect(options.headers['Content-Type']).toBe('application/json');
    });

    it('should throw APIError with correct details', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      try {
        await tmdbClient.getNowPlaying(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        const apiError = error as APIError;
        expect(apiError.status).toBe(404);
        expect(apiError.statusText).toBe('Not Found');
        expect(apiError.message).toBe('API request failed: Not Found');
      }
    });

    it.each([1, 2, 10])('should handle page=%i parameter', async (page) => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], page }),
      });
      globalThis.fetch = mockFetch;

      await tmdbClient.getNowPlaying(page);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain(`page=${page}`);
    });
  });

  // 目前其他 methods 只有 endpoint 不同，故先用 smoke tests 驗證 endpoint 正確性
  describe('API endpoints', () => {
    it.each([
      { method: 'getPopular', expectedPath: '/movie/popular' },
      { method: 'getTopRated', expectedPath: '/movie/top_rated' },
      { method: 'getUpcoming', expectedPath: '/movie/upcoming' },
    ])(
      '$method should call correct endpoint',
      async ({ method, expectedPath }) => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ results: [] }),
        });
        globalThis.fetch = mockFetch;

        await (
          tmdbClient[method as keyof typeof tmdbClient] as (
            page?: number
          ) => Promise<unknown>
        )();

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain(expectedPath);
      }
    );
  });
});
