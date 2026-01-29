import { Container, Stack, Text, Select, Group, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useMovieSearch } from '@/features/movies/hooks/useMovieSearch';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchBar } from '@/features/movies/components/SearchBar';
import { SearchResult } from '@/features/movies/components/SearchResult';
import { LoadingState, EmptyState, ScrollToTop } from '@/components';
import type { SortOption } from '@/features/movies/hooks/useMovieSearch';

/**
 * SearchPage 元件
 *
 * 電影搜尋頁面，包含：
 * - 搜尋輸入框
 * - 搜尋結果顯示
 * - 排序功能（前端排序）
 * - 無限滾動（僅限相關性排序）
 */
export function SearchPage() {
  // 從 URL 讀取搜尋參數
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const {
    movies,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    setQuery,
    setSortBy,
    sortBy,
    query,
  } = useMovieSearch();

  /**
   * URL 同步
   */
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]); // 只依賴 urlQuery，避免無限迴圈

  /**
   * 無限滾動
   * 注意：只有在相關性排序時，hasMore 才會是 true
   */
  useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loading,
    threshold: 300, // 距離底部 300px 時載入
    throttleMs: 200, // 200ms 內最多觸發一次
  });

  /**
   * 處理搜尋輸入
   * 同時更新 hook 的 query 和 URL 的 query parameter
   */
  const handleSearch = (value: string) => {
    setQuery(value);

    // 更新 URL
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }

    // 新搜尋時重置排序
    if (value.trim() !== query.trim()) {
      setSortBy('relevance');
    }
  };

  /**
   * 清除搜尋
   */
  const handleClearSearch = () => {
    setQuery('');
    setSearchParams({});
    setSortBy('relevance');
  };

  /**
   * 重試搜尋
   */
  const handleRetry = () => {
    if (query) {
      setQuery(query);
    }
  };

  /**
   * 初始狀態：使用者還沒有輸入任何搜尋字串
   */
  const showInitialState = !query && !loading;

  return (
    <>
      <Container size="lg" py={{ base: 'md', sm: 'xl' }}>
        <Stack gap="xl">
          {/* 頁面標題和搜尋框 */}
          <Stack gap="md">
            <Title order={1} size="h3">
              Search Movies
            </Title>

            {/* 搜尋輸入框 */}
            <SearchBar
              value={query}
              onChange={handleSearch}
              onClear={handleClearSearch}
            />

            {/* 搜尋結果資訊和排序選項 */}
            {movies.length > 0 && (
              <Group justify="space-between" align="center">
                <Text c="dimmed">
                  {/* 根據排序模式顯示不同訊息 */}
                  {sortBy === 'relevance' ? (
                    <>
                      Found {totalResults.toLocaleString()} result
                      {totalResults !== 1 ? 's' : ''}
                      {query && ` for "${query}"`}
                    </>
                  ) : (
                    <>
                      Showing {movies.length} of {totalResults.toLocaleString()}{' '}
                      result
                      {totalResults !== 1 ? 's' : ''}
                      {query && ` for "${query}"`}
                    </>
                  )}
                </Text>

                {/* 排序選項 */}
                <Select
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                  data={[
                    { value: 'relevance', label: 'Most Relevant' },
                    { value: 'popularity', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'date', label: 'Release Date' },
                    { value: 'title', label: 'Title (A-Z)' },
                  ]}
                  size="sm"
                  w={{ base: '100%', xs: 200 }}
                  label="Sort by"
                />
              </Group>
            )}
          </Stack>

          {/* 初始狀態：提示使用者開始搜尋 */}
          {showInitialState && (
            <EmptyState
              icon={<IconSearch size={48} />}
              title="Start searching for movies"
              message="Enter a movie title, keyword, or phrase to begin"
            />
          )}

          {/* 搜尋結果（包含所有狀態處理） */}
          {query && (
            <SearchResult
              movies={movies}
              isLoading={loading}
              error={error}
              query={query}
              onRetry={handleRetry}
            />
          )}

          {/* 載入中 */}
          {loading && movies.length > 0 && (
            <LoadingState message="Loading more results..." minHeight={100} />
          )}

          {/* 相關性排序：顯示「已到底部」 */}
          {!hasMore &&
            movies.length > 0 &&
            !loading &&
            sortBy === 'relevance' && (
              <Text c="dimmed" ta="center" py="xl">
                You've reached the end of the results
              </Text>
            )}

          {/* 其他排序：提示使用者切換回相關性來載入更多 */}
          {!loading &&
            movies.length > 0 &&
            sortBy !== 'relevance' &&
            movies.length < totalResults && (
              <Text c="dimmed" ta="center" py="xl">
                Showing {movies.length} of {totalResults} results.
                <br />
                <Text
                  span
                  c="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSortBy('relevance')}
                  td="underline"
                >
                  Switch to "Most Relevant"
                </Text>{' '}
                to load more results.
              </Text>
            )}
        </Stack>
      </Container>
      <ScrollToTop />
    </>
  );
}
