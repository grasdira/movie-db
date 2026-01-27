import {
  Container,
  TextInput,
  Loader,
  Alert,
  Stack,
  Text,
  Select,
  Group,
  ActionIcon,
  Title,
} from '@mantine/core';
import {
  IconSearch,
  IconX,
  IconAlertCircle,
  IconMoodSad,
} from '@tabler/icons-react';
import { useState, useMemo, useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useSearchParams } from 'react-router';
import { useMovieSearch } from '@/features/movies/hooks/useMovieSearch';
import { MovieListItem } from '@/features/movies/components/MovieListItem';
import styles from './SearchPage.module.css';

/**
 * 排序選項的型別定義
 *
 * 選項說明:
 * - popularity: 按熱門程度排序(預設)
 * - rating: 按評分排序
 * - date: 按上映日期排序
 * - title: 按標題字母順序排序
 */
type SortOption = 'popularity' | 'rating' | 'date' | 'title';

/**
 * SearchPage 元件
 */
export function SearchPage() {
  // 從 URL 讀取搜尋參數
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // 使用搜尋 hook
  const {
    movies,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    setQuery,
    query,
  } = useMovieSearch();

  // 排序狀態
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  /**
   * 當 URL 的 query 改變時，更新 hook 的 query
   */
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]); // 只依賴 urlQuery，避免無限迴圈

  /**
   * 設定無限滾動的觀察目標
   *
   * 使用 Mantine 的 useIntersection hook 來檢測元素是否進入視窗
   * 當「哨兵」元素進入視窗時,自動載入下一頁
   *
   * 這比傳統的 scroll 事件監聽更有效率,
   * 因為 IntersectionObserver 是瀏覽器原生優化的 API
   */
  const { ref: sentinelRef, entry } = useIntersection({
    threshold: 0.1, // 當元素 10% 進入視窗時觸發
  });

  /**
   * 當哨兵元素進入視窗時載入更多
   *
   * 條件:
   * - 哨兵元素可見
   * - 還有更多結果可以載入
   * - 目前沒有正在載入
   */
  if (entry?.isIntersecting && hasMore && !loading) {
    loadMore();
  }

  /**
   * 排序後的電影列表
   *
   * 使用 useMemo 來快取排序結果,避免每次 render 都重新排序
   * 只有當 movies 或 sortBy 改變時才重新排序
   */
  const sortedMovies = useMemo(() => {
    // 建立副本進行排序,避免修改原始陣列
    const sorted = [...movies];

    switch (sortBy) {
      case 'rating':
        // 按評分降序排序
        return sorted.sort((a, b) => b.rating - a.rating);

      case 'date':
        // 按上映日期降序排序(新的在前)
        return sorted.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );

      case 'title':
        // 按標題字母順序排序
        // 使用 localeCompare 來正確處理特殊字元和大小寫
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
        );

      default:
        // 預設按熱門程度降序排序
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  }, [movies, sortBy]);

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

    // 當使用者開始新的搜尋時，重置排序為熱門程度
    if (value.trim() !== query.trim()) {
      setSortBy('popularity');
    }
  };

  /**
   * 清除搜尋
   */
  const handleClearSearch = () => {
    setQuery('');
    setSearchParams({}); // 清除 URL 的 query parameter
    setSortBy('popularity');
  };

  /**
   * 判斷是否應該顯示空狀態
   *
   * 空狀態的情況:
   * 1. 有搜尋字串
   * 2. 沒有載入中
   * 3. 沒有錯誤
   * 4. 沒有結果
   */
  const showEmptyState =
    query.trim() !== '' && !loading && !error && movies.length === 0;

  /**
   * 判斷是否應該顯示初始狀態
   *
   * 初始狀態:使用者還沒有輸入任何搜尋字串
   */
  const showInitialState = query.trim() === '' && !loading;

  return (
    <Container size="lg" py={{ base: 'md', sm: 'xl' }}>
      <Stack gap="xl">
        {/* 頁面標題和搜尋框 */}
        <Stack gap="md">
          <Title order={1} size="h3">
            Search Movies
          </Title>

          {/* 搜尋輸入框 */}
          <TextInput
            placeholder="Search for movies..."
            size="lg"
            leftSection={<IconSearch size={20} />}
            rightSection={
              query && (
                <ActionIcon
                  variant="subtle"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <IconX size={20} />
                </ActionIcon>
              )
            }
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* 搜尋結果資訊和排序選項 */}
          {movies.length > 0 && (
            <Group justify="space-between" align="center">
              <Text c="dimmed">
                Found {totalResults.toLocaleString()} result
                {totalResults !== 1 ? 's' : ''}
                {query && ` for "${query}"`}
              </Text>

              {/* 排序選項 */}
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                data={[
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

        {/* 初始狀態:提示使用者開始搜尋 */}
        {showInitialState && (
          <div className={styles.centerContent}>
            <Stack align="center" gap="md">
              <IconSearch size={64} className={styles.emptyIcon} />
              <Title order={2} size="h3">
                Start searching for movies
              </Title>
              <Text c="dimmed" size="lg" ta="center">
                Enter a movie title, keyword, or phrase to begin
              </Text>
            </Stack>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Search failed"
            color="red"
            variant="filled"
          >
            {error.message}
          </Alert>
        )}

        {/* 空搜尋結果 */}
        {showEmptyState && (
          <div className={styles.centerContent}>
            <Stack align="center" gap="md">
              <IconMoodSad size={64} className={styles.emptyIcon} />
              <Title order={2} size="h3">
                No results found
              </Title>
              <Text c="dimmed" size="lg" ta="center">
                Try searching with different keywords or check your spelling
              </Text>
            </Stack>
          </div>
        )}

        {/* 搜尋結果列表 */}
        {sortedMovies.length > 0 && (
          <Stack gap="md">
            {sortedMovies.map((movie) => (
              <MovieListItem key={movie.id} movie={movie} />
            ))}
          </Stack>
        )}

        {/* 載入指示器 - 初次搜尋 */}
        {loading && movies.length === 0 && (
          <div className={styles.centerContent}>
            <Loader size="xl" />
          </div>
        )}

        {/* 無限滾動哨兵和載入指示器 */}
        {hasMore && movies.length > 0 && (
          <div ref={sentinelRef} className={styles.loadingMore}>
            {loading && (
              <Group justify="center" p="xl">
                <Loader size="md" />
                <Text c="dimmed">Loading more results...</Text>
              </Group>
            )}
          </div>
        )}

        {/* 已載入所有結果的提示 */}
        {!hasMore && movies.length > 0 && !loading && (
          <Text c="dimmed" ta="center" py="xl">
            You've reached the end of the results
          </Text>
        )}
      </Stack>
    </Container>
  );
}
