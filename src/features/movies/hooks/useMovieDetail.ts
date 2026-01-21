import { useState, useEffect } from 'react';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import type { MovieDetail } from '@/features/movies/types/movie';

/**
 * useMovieDetail hook 的回傳型別
 */
interface UseMovieDetailReturn {
  movie: MovieDetail | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 載入單一電影的詳細資訊
 *
 * 這個 hook 負責載入完整的電影資訊,包含:
 * - 基本資訊(標題、評分、上映日期等)
 * - 演員陣容
 * - 劇組人員
 * - 預告片和影片
 * - 評論
 *
 * @param movieId - 電影 ID
 * @returns 包含電影詳細資料、載入狀態和錯誤狀態的物件
 *
 * @example
 * ```tsx
 * function MovieDetailPage() {
 *   const { id } = useParams();
 *   const { movie, loading, error } = useMovieDetail(Number(id));
 *
 *   if (loading) return <Loader />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!movie) return <NotFound />;
 *
 *   return <MovieDetailView movie={movie} />;
 * }
 * ```
 */
export function useMovieDetail(movieId: number): UseMovieDetailReturn {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * 載入電影詳細資訊
     *
     * 設計考量:
     * 1. 使用 async function 包裝,避免直接在 useEffect 中使用 async
     * 2. 在開始載入前重置 error 狀態
     * 3. 使用 finally 確保無論成功或失敗都會設定 loading 為 false
     */
    async function fetchMovieDetail() {
      // 如果 movieId 無效,直接返回
      if (!movieId || movieId <= 0) {
        setError(new Error('Invalid movie ID'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await MovieRepository.getMovieDetail(movieId);
        setMovie(result);
      } catch (err) {
        // 確保 error 永遠是 Error 物件,方便 UI 層使用
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetail();
  }, [movieId]); // 當 movieId 改變時重新載入

  return { movie, loading, error };
}
