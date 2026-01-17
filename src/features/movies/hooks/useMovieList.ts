import { useState, useEffect } from 'react';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import type { Movie, MovieCategory } from '@/features/movies/types/movie';

/**
 * useMovieList hook 的回傳型別
 */
interface UseMovieListReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
}

/**
 * 載入指定分類的電影列表
 *
 * 這個 hook 專門處理電影列表的初始載入,只取得第一頁資料。
 * 適用於首頁的電影分類預覽,不支援分頁載入。
 *
 * @param category - 電影分類類型
 * @returns 包含電影資料、載入狀態和錯誤狀態的物件
 *
 * @example
 * ```tsx
 * function PopularMovies() {
 *   const { movies, loading, error } = useMovieList('popular');
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <MovieGrid movies={movies} />;
 * }
 * ```
 */
export function useMovieList(category: MovieCategory): UseMovieListReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * 根據分類載入電影資料
     *
     * 設計考量:
     * 1. 使用 async function 包裝,避免直接在 useEffect 中使用 async
     * 2. 在開始載入前重置 error 狀態,確保不會顯示舊的錯誤訊息
     * 3. 使用 finally 確保無論成功或失敗都會設定 loading 為 false
     */
    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        // 根據 category 呼叫對應的 Repository method
        // 使用 switch 而非物件映射,因為每個 method 的型別都是明確的
        let result;
        switch (category) {
          case 'popular':
            result = await MovieRepository.getPopular();
            break;
          case 'nowPlaying':
            result = await MovieRepository.getNowPlaying();
            break;
          case 'topRated':
            result = await MovieRepository.getTopRated();
            break;
          case 'upcoming':
            result = await MovieRepository.getUpcoming();
            break;
        }

        setMovies(result.movies);
      } catch (err) {
        // 確保 error 永遠是 Error 物件,方便 UI 層使用
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [category]); // 當 category 改變時重新載入

  return { movies, loading, error };
}
