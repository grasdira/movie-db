import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import type { Movie } from '@/features/movies/types/movie';

/**
 * useMovieSearch hook 的回傳型別
 */
interface UseMovieSearchReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalResults: number;
  loadMore: () => void;
  setQuery: (query: string) => void;
  query: string;
}

/**
 * useMovieSearch Hook
 *
 * 封裝電影搜尋的所有邏輯,包括:
 * - Debounce 處理:避免使用者每打一個字就發送請求
 * - 分頁載入:支援無限滾動
 * - 狀態管理:loading, error, results
 * - 請求取消:當使用者輸入新的搜尋字串時,取消舊的請求
 *
 * @returns {UseMovieSearchReturn} 搜尋狀態和控制方法
 */
export function useMovieSearch(): UseMovieSearchReturn {
  // 搜尋關鍵字
  const [query, setQuery] = useState('');

  // 使用 Mantine 的 useDebouncedValue 來實作 debounce
  // 300ms 的延遲是搜尋功能的最佳實踐
  const [debouncedQuery] = useDebouncedValue(query, 300);

  // 搜尋結果
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 分頁資訊
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // 用於取消請求的 AbortController
  // 使用 useRef 因為我們不需要在它改變時觸發 re-render
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 執行搜尋
   *
   * 處理實際的 API 呼叫和狀態更新
   * 它支援兩種模式:
   * 1. 新搜尋:清空現有結果,從第一頁開始
   * 2. 載入更多:保留現有結果,載入下一頁並累加
   *
   * @param searchQuery - 搜尋關鍵字
   * @param page - 要載入的頁碼
   * @param isLoadMore - 是否為載入更多(而非新搜尋)
   */
  const performSearch = useCallback(
    async (searchQuery: string, page: number, isLoadMore: boolean = false) => {
      // 如果搜尋字串為空,清空結果
      if (!searchQuery || searchQuery.trim() === '') {
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      // 取消之前的請求(如果有的話)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 建立新的 AbortController
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const result = await MovieRepository.searchMovies(searchQuery, page);

        // 檢查請求是否已被取消
        // 如果使用者在請求完成前輸入了新的搜尋字串,
        // 舊的請求會被取消,我們不應該更新狀態
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        // 更新搜尋結果
        if (isLoadMore) {
          // 載入更多:累加到現有結果
          setMovies((prevMovies) => [...prevMovies, ...result.movies]);
        } else {
          // 新搜尋:替換現有結果
          setMovies(result.movies);
        }

        setTotalPages(result.totalPages);
        setTotalResults(result.totalResults);
        setCurrentPage(page);
      } catch (err) {
        // 如果請求被取消,不要設定錯誤狀態
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorObject =
          err instanceof Error ? err : new Error('Failed to search movies');
        setError(errorObject);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 當 debounced query 改變時觸發搜尋
   */
  useEffect(() => {
    performSearch(debouncedQuery, 1, false);
  }, [debouncedQuery, performSearch]);

  /**
   * 載入更多結果
   *
   * 用於實作無限滾動:當使用者滾動到列表底部時，呼叫這個函數載入下一頁的結果
   *
   * 保護機制:
   * - 如果正在載入中,不發送新請求
   * - 如果已經是最後一頁,不發送新請求
   * - 如果沒有搜尋字串,不發送請求
   */
  const loadMore = useCallback(() => {
    // 保護條件:避免重複請求或無效請求
    if (loading || currentPage >= totalPages || !debouncedQuery) {
      return;
    }

    // 載入下一頁
    const nextPage = currentPage + 1;
    performSearch(debouncedQuery, nextPage, true);
  }, [loading, currentPage, totalPages, debouncedQuery, performSearch]);

  /**
   * 計算是否還有更多結果可以載入
   *
   * 用於控制「載入更多」按鈕的顯示,或無限滾動的觸發
   */
  const hasMore = currentPage < totalPages;

  /**
   * Cleanup: 當元件卸載時取消進行中的請求
   *
   * 這避免了 React 警告:試圖在已卸載的元件上設定狀態
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    movies,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    setQuery,
    query,
  };
}
