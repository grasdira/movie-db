import { useState, useEffect, useCallback } from 'react';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import type { Review } from '@/features/movies/types/movie';

interface UseMovieReviewsResult {
  reviews: Review[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * useMovieReviews Hook
 *
 * 管理電影評論的載入與分頁
 * 支援按鈕式載入更多評論
 *
 * @param movieId - 電影 ID
 * @param initialReviews - 從 MovieDetail 帶來的初始評論資料
 * @param initialPage - 初始頁碼（預設為 1）
 * @param initialTotalPages - 總頁數
 */
export function useMovieReviews(
  movieId: number,
  initialReviews: Review[] = [],
  initialPage: number = 1,
  initialTotalPages: number = 1
): UseMovieReviewsResult {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 是否還有更多評論
  const hasMore = currentPage < totalPages;

  /**
   * 載入更多評論
   */
  const loadMore = useCallback(async () => {
    // 防止重複載入
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = currentPage + 1;
      const result = await MovieRepository.getMovieReviews(movieId, nextPage);

      // 附加新評論到現有列表
      setReviews((prev) => [...prev, ...result.reviews]);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load reviews')
      );
      console.error('[useMovieReviews] Error loading more reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId, currentPage, loading, hasMore]);

  // 當 movieId 改變時重置狀態
  useEffect(() => {
    setReviews(initialReviews);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
    setError(null);
  }, [movieId, initialReviews, initialPage, initialTotalPages]);

  return {
    reviews,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
