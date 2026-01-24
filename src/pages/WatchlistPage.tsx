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
          popularity: detail.popularity || 0, // 加入這一行
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
  }, [movieIds]);

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
          {/* 頁面標題 */}
          <Group justify="space-between" align="center">
            <div>
              <Title order={1}>My Watchlist</Title>
              <Text c="dimmed" mt="xs">
                {count} {count === 1 ? 'movie' : 'movies'} in your watchlist
              </Text>
            </div>
            {count > 0 && (
              <Button
                variant="subtle"
                color="red"
                onClick={handleClearWatchlist}
              >
                Clear All
              </Button>
            )}
          </Group>

          {/* 電影列表 */}
          <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
            spacing="md"
          >
            {movies.map((movie) => (
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
