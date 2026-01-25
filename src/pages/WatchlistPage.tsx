import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Loader,
  Alert,
  Stack,
  Button,
  Group,
  Select,
} from '@mantine/core';
import { IconAlertCircle, IconBookmarkOff } from '@tabler/icons-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  useWatchlistItems,
  useWatchlistCount,
  useWatchlistActions,
} from '@/features/watchlist/store';
import { MovieRepository } from '@/features/movies/services/MovieRepository';
import { MovieCard } from '@/features/movies/components/MovieCard';
import { MovieDetailModal } from '@/features/movies/components/MovieDetailModal';
import type { Movie } from '@/features/movies/types/movie';
import styles from './WatchlistPage.module.css';

/**
 * 排序選項的型別定義
 *
 * WatchlistPage 特有的排序選項:
 * - addedAt: 按加入時間排序(預設),利用 WatchlistItem 的 addedAt 欄位
 * - rating: 按評分排序,從高到低
 * - releaseDate: 按上映日期排序,新電影在前
 * - title: 按標題字母順序排序
 */
type SortOption = 'addedAt' | 'rating' | 'releaseDate' | 'title';

/**
 * WatchlistPage 元件
 *
 * 顯示使用者的待看清單
 * 從 watchlist 中載入電影 ID,然後從 API 取得完整的電影資訊
 *
 * 使用 Zustand:
 * - useWatchlistItems: 取得所有 watchlist 項目
 * - useWatchlistCount: 取得項目數量
 * - useWatchlistActions: 取得操作方法
 *
 * 效能優化:
 * - 使用 useMemo 來避免不必要的重新載入
 * - 只在初次載入時顯示 loading 狀態,避免閃動
 * - 背景更新資料,保持 UI 的流暢性
 */
export function WatchlistPage() {
  const navigate = useNavigate();

  // Zustand hooks - 只訂閱需要的狀態
  const items = useWatchlistItems();
  const count = useWatchlistCount();
  const { clearWatchlist } = useWatchlistActions();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /**
   * 排序狀態
   *
   * 預設使用 addedAt(加入時間)排序
   */
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');

  /**
   * 提取並快取 movie IDs
   *
   * useMemo 確保只有當實際的 movieId 列表改變時,才會產生新陣列。
   * 這樣可以避免在 Modal 中操作 watchlist 時觸發不必要的資料重新載入。
   */
  const movieIds = useMemo(() => items.map((item) => item.movieId), [items]);

  /**
   * 載入 watchlist 中的電影資訊
   */
  useEffect(() => {
    async function loadWatchlistMovies() {
      if (movieIds.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      /**
       * 條件性的 loading 狀態
       *
       * 只有在真正的初次載入時(movies 陣列為空)才顯示 loading。
       * 如果已經有資料,就在背景更新,不顯示 loading。
       *
       * 這解決了閃動問題:
       * - 當使用者在 Modal 中移除電影時,movieIds 會改變
       * - useEffect 會被觸發,重新載入資料
       * - 但因為 movies.length > 0,不會設定 loading = true
       * - 使用者看到的是無縫的更新,而不是整個頁面重新載入
       */
      const isInitialLoad = movies.length === 0;
      if (isInitialLoad) {
        setLoading(true);
      }

      setError(null);

      try {
        // 為每個 movieId 載入詳細資訊
        const moviePromises = movieIds.map((movieId) =>
          MovieRepository.getMovieDetail(movieId)
        );

        const loadedMovies = await Promise.all(moviePromises);

        // 轉換為 Movie 型別 (只取基本資訊)
        const basicMovies: Movie[] = loadedMovies.map((detail) => ({
          id: detail.id,
          title: detail.title,
          originalTitle: detail.originalTitle,
          originalLanguage: detail.originalLanguage,
          overview: detail.overview,
          posterUrl: detail.posterUrl,
          backdropUrl: detail.backdropUrl,
          releaseDate: detail.releaseDate,
          rating: detail.rating,
          voteCount: detail.voteCount,
          popularity: detail.popularity || 0,
        }));

        setMovies(basicMovies);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load watchlist')
        );
      } finally {
        setLoading(false);
      }
    }

    loadWatchlistMovies();
  }, [movieIds]); // 依賴 movieIds 而不是 items

  /**
   * 排序後的電影列表
   *
   * 使用 useMemo 快取排序結果,只有在以下情況才重新排序:
   * 1. movies 陣列改變(載入了新的電影資料)
   * 2. sortBy 改變(使用者選擇了不同的排序方式)
   * 3. items 改變(用於 addedAt 排序,因為需要時間戳記資訊)
   */
  const sortedMovies = useMemo(() => {
    if (sortBy === 'addedAt') {
      // 按加入時間排序
      const orderMap = new Map(
        items.map((item, index) => [item.movieId, index])
      );
      return [...movies].sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? Infinity;
        const orderB = orderMap.get(b.id) ?? Infinity;
        return orderA - orderB;
      });
    }

    // 對於其他排序方式,建立副本進行排序
    const sorted = [...movies];

    switch (sortBy) {
      case 'rating':
        // 按評分降序排序
        return sorted.sort((a, b) => b.rating - a.rating);

      case 'releaseDate':
        // 按上映日期降序排序(新的在前)
        return sorted.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );

      case 'title':
        // 按標題字母順序排序
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
        );

      default:
        return sorted;
    }
  }, [movies, sortBy, items]);

  /**
   * 處理電影卡片點擊
   */
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  /**
   * 關閉 Modal
   */
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  /**
   * 前往電影詳細頁面
   */
  const handleViewDetail = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  /**
   * 清空 watchlist
   */
  const handleClearWatchlist = () => {
    if (
      window.confirm('Are you sure you want to clear your entire watchlist?')
    ) {
      clearWatchlist();
    }
  };

  // 載入狀態
  if (loading) {
    return (
      <div className={styles.centerContent}>
        <Loader size="xl" />
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={24} />}
          title="Failed to load watchlist"
          color="red"
          variant="filled"
        >
          {error.message}
        </Alert>
      </Container>
    );
  }

  // 空狀態
  if (count === 0) {
    return (
      <Container size="lg" py="xl">
        <div className={styles.emptyState}>
          <IconBookmarkOff size={64} className={styles.emptyIcon} />
          <Title order={2} mt="md">
            Your watchlist is empty
          </Title>
          <Text c="dimmed" mt="sm" size="lg">
            Start adding movies to your watchlist to keep track of what you want
            to watch
          </Text>
          <Button size="lg" mt="xl" onClick={() => navigate('/')}>
            Browse Movies
          </Button>
        </div>
      </Container>
    );
  }

  // 顯示電影列表
  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* 頁面標題和控制項 */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>My Watchlist</Title>
              <Text c="dimmed" mt="xs">
                {count} {count === 1 ? 'movie' : 'movies'} in your watchlist
              </Text>
            </div>

            {/* 右側控制區:排序和清空按鈕 */}
            <Group gap="md">
              {/* 排序選項 */}
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                data={[
                  { value: 'addedAt', label: 'Recently Added' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'releaseDate', label: 'Release Date' },
                  { value: 'title', label: 'Title (A-Z)' },
                ]}
                size="sm"
                w={{ base: '100%', xs: 180 }}
                label="Sort by"
              />

              {/* 清空按鈕 */}
              {count > 0 && (
                <Button
                  variant="subtle"
                  color="red"
                  onClick={handleClearWatchlist}
                  size="sm"
                  mt="auto"
                >
                  Clear All
                </Button>
              )}
            </Group>
          </Group>

          {/* 電影列表 */}
          <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
            spacing="md"
          >
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* 電影詳細資訊 Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        opened={selectedMovie !== null}
        onClose={handleCloseModal}
        onViewDetail={handleViewDetail}
      />
    </>
  );
}
