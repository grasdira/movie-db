import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import type { Movie } from '@/features/movies/types/movie';

/**
 * 排序選項
 *
 * - relevance: API 預設排序（最相關），支援無限滾動
 * - popularity: 按熱門程度排序（前端）
 * - rating: 按評分排序（前端）
 * - date: 按上映日期排序（前端）
 * - title: 按標題字母順序排序（前端）
 */
export type SortOption =
  | 'relevance'
  | 'popularity'
  | 'rating'
  | 'date'
  | 'title';

interface UseMovieSearchReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalResults: number;
  loadMore: () => void;
  setQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  sortBy: SortOption;
  query: string;
}

/**
 * useMovieSearch Hook
 *
 * 封裝電影搜尋的所有邏輯，包括：
 * - Debounce 處理：避免使用者每打一個字就發送請求
 * - 無限滾動：僅限相關性排序時支援
 * - 前端排序：popularity, rating, date, title
 * - 狀態管理：loading, error, results
 * - 請求取消：當使用者輸入新的搜尋字串時，取消舊的請求
 * - 去重處理：過濾重複的電影資料
 *
 * @returns {UseMovieSearchReturn} 搜尋狀態和控制方法
 *
 * @example
 * ```tsx
 * const { movies, loading, loadMore, setQuery, setSortBy } = useMovieSearch();
 *
 * // 搜尋電影
 * setQuery('spider-man');
 *
 * // 改變排序（會禁用無限滾動）
 * setSortBy('popularity');
 * ```
 */
export function useMovieSearch(): UseMovieSearchReturn {
  // 搜尋關鍵字
  const [query, setQuery] = useState('');

  // Debounce：300ms 延遲，避免過於頻繁的 API 請求
  const [debouncedQuery] = useDebouncedValue(query, 300);

  // 搜尋結果
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 分頁資訊
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // 排序選項（預設為相關性）
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // 防止重複請求的 flag（使用 ref 避免觸發 re-render）
  const isLoadingRef = useRef(false);

  // 用於取消進行中的請求
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 執行搜尋
   *
   * @param searchQuery - 搜尋關鍵字
   * @param page - 要載入的頁碼
   * @param isLoadMore - 是否為載入更多（true）或新搜尋（false）
   */
  const performSearch = useCallback(
    async (searchQuery: string, page: number, isLoadMore: boolean = false) => {
      // 空字串：清空結果
      if (!searchQuery || searchQuery.trim() === '') {
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
        setCurrentPage(1);
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      // 防護：如果正在載入，跳過
      if (isLoadingRef.current) {
        console.log('[useMovieSearch] Already loading, skipping');
        return;
      }

      // 取消之前的請求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // 開始載入
      setLoading(true);
      isLoadingRef.current = true;
      setError(null);

      try {
        console.log(`[useMovieSearch] 🔄 Fetching page ${page}`);
        const result = await MovieRepository.searchMovies(searchQuery, page);

        // 檢查請求是否已被取消
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (isLoadMore) {
          // 載入更多：去重後附加到現有結果
          setMovies((prevMovies) => {
            const existingIds = new Set(prevMovies.map((m) => m.id));
            const newMovies = result.movies.filter(
              (movie) => !existingIds.has(movie.id)
            );

            console.log(`[useMovieSearch] ✅ Page ${page} appended:`, {
              previous: prevMovies.length,
              new: newMovies.length,
              total: prevMovies.length + newMovies.length,
            });

            return [...prevMovies, ...newMovies];
          });
        } else {
          // 新搜尋：去重後替換
          const uniqueMovies = Array.from(
            new Map(result.movies.map((m) => [m.id, m])).values()
          );

          console.log(`[useMovieSearch] ✅ Initial search:`, {
            total: uniqueMovies.length,
          });

          setMovies(uniqueMovies);
        }

        // 更新分頁資訊
        setTotalPages(result.totalPages);
        setTotalResults(result.totalResults);
        setCurrentPage(page);
      } catch (err) {
        // 如果請求被取消，不設定錯誤
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorObject =
          err instanceof Error ? err : new Error('Failed to search movies');
        setError(errorObject);
        console.error('[useMovieSearch] ❌ Error:', err);
      } finally {
        // 重置載入狀態
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    []
  );

  /**
   * Effect: 當搜尋關鍵字改變時，從第一頁開始搜尋
   */
  useEffect(() => {
    performSearch(debouncedQuery, 1, false);
  }, [debouncedQuery, performSearch]);

  /**
   * 載入下一頁
   *
   * 限制：
   * - 只有在相關性排序時才支援無限滾動
   * - 其他排序模式會禁用此功能
   */
  const loadMore = useCallback(() => {
    // 檢查：只有相關性排序支援無限滾動
    if (sortBy !== 'relevance') {
      console.log(
        '[useMovieSearch] Infinite scroll disabled for custom sorting'
      );
      return;
    }

    // 防護：正在載入、已到最後一頁、或沒有搜尋字串
    if (isLoadingRef.current || currentPage >= totalPages || !debouncedQuery) {
      return;
    }

    const nextPage = currentPage + 1;
    console.log(`[useMovieSearch] 📄 Loading page ${nextPage}`);
    performSearch(debouncedQuery, nextPage, true);
  }, [sortBy, currentPage, totalPages, debouncedQuery, performSearch]);

  /**
   * 是否還有更多資料可以載入
   *
   * 條件：
   * - 必須是相關性排序
   * - 且當前頁數 < 總頁數
   */
  const hasMore = sortBy === 'relevance' && currentPage < totalPages;

  /**
   * 排序後的電影列表
   *
   * 邏輯：
   * - relevance: 使用 API 原始順序（最相關）
   * - 其他選項: 在前端對已載入的資料進行排序
   */
  const displayMovies = useMemo(() => {
    // 相關性排序：直接回傳
    if (sortBy === 'relevance') {
      return movies;
    }

    // 前端排序：建立副本避免修改原陣列
    const sorted = [...movies];

    switch (sortBy) {
      case 'popularity':
        // 按熱門程度降序
        return sorted.sort((a, b) => b.popularity - a.popularity);

      case 'rating':
        // 按評分降序
        return sorted.sort((a, b) => b.rating - a.rating);

      case 'date':
        // 按上映日期降序（新的在前）
        return sorted.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );

      case 'title':
        // 按標題字母順序升序（A-Z）
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
        );

      default:
        return sorted;
    }
  }, [movies, sortBy]);

  /**
   * Cleanup: 元件卸載時取消進行中的請求
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isLoadingRef.current = false;
    };
  }, []);

  return {
    movies: displayMovies,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    setQuery,
    setSortBy,
    sortBy,
    query,
  };
}
