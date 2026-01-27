import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  Tooltip,
} from '@mantine/core';
import {
  IconStarFilled,
  IconClock,
  IconBookmark,
  IconBookmarkFilled,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
  useIsInWatchlist,
  useWatchlistActions,
} from '@/features/watchlist/store';
import type { MovieDetail } from '@/features/movies/types/movie';
import styles from './MovieHero.module.css';

interface MovieHeroProps {
  movie: MovieDetail;
}

/**
 * MovieHero 元件
 *
 * 電影詳細頁面的頂部大型橫幅區域
 * 包含:
 * - 背景圖片(模糊的 backdrop)
 * - 電影海報
 * - 標題和基本資訊(評分、上映年份、片長)
 * - 類型標籤
 * - 宣傳標語
 * - Watchlist 按鈕
 */
export function MovieHero({ movie }: MovieHeroProps) {
  // Watchlist 狀態和操作
  const isInWatchlist = useIsInWatchlist(movie.id);
  const { toggleWatchlist } = useWatchlistActions();

  const releaseYear = movie.releaseDate.split('-')[0];
  const formattedRating = movie.rating.toFixed(1);

  // 格式化片長 (例如: 148 分鐘 -> 2h 28m)
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const runtime = formatRuntime(movie.runtime);

  /**
   * 處理 Watchlist 按鈕點擊
   */
  const handleToggleWatchlist = () => {
    const added = toggleWatchlist(movie.id);

    if (added) {
      notifications.show({
        title: 'Added to Watchlist',
        message: `${movie.title} has been added to your watchlist`,
        color: 'blue',
        icon: <IconBookmarkFilled size={18} />,
      });
    } else {
      notifications.show({
        title: 'Removed from Watchlist',
        message: `${movie.title} has been removed from your watchlist`,
        color: 'gray',
      });
    }
  };

  return (
    <div className={styles.hero}>
      {/* 背景圖片 */}
      <div className={styles.backdrop}>
        <div
          className={styles.backdropImage}
          style={{
            backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
          }}
        />
        <div className={styles.backdropOverlay} />
      </div>

      {/* 內容 */}
      <Container size="lg" className={styles.content}>
        <div className={styles.heroContent}>
          {/* 海報 */}
          <div className={styles.posterWrapper}>
            <img
              src={movie.posterUrl || undefined}
              alt={movie.title}
              className={styles.poster}
            />
          </div>

          {/* 資訊 */}
          <Stack gap="md" className={styles.info}>
            {/* 標題 */}
            <div>
              <Title order={1} className={styles.title}>
                {movie.title}
              </Title>
              {movie.originalTitle !== movie.title && (
                <Text size="lg" c="dimmed" fs="italic" mt="xs">
                  {movie.originalTitle}
                </Text>
              )}
            </div>

            {/* 評分、基本資訊和 Watchlist 按鈕 */}
            <Group gap="md" wrap="wrap">
              <Badge
                leftSection={<IconStarFilled size={14} />}
                size="lg"
                variant="filled"
                color="yellow"
                className={styles.ratingBadge}
              >
                {formattedRating}
              </Badge>
              <Text size="sm" c="dimmed">
                {movie.voteCount.toLocaleString()} votes
              </Text>
              <Text size="md" fw={500}>
                {releaseYear}
              </Text>
              {runtime && (
                <Group gap={4}>
                  <IconClock size={16} />
                  <Text size="md">{runtime}</Text>
                </Group>
              )}

              {/* Watchlist 按鈕 */}
              <Tooltip
                label={
                  isInWatchlist
                    ? 'Remove from your watchlist'
                    : 'Add to your watchlist'
                }
              >
                <Button
                  leftSection={
                    isInWatchlist ? (
                      <IconBookmarkFilled size={18} />
                    ) : (
                      <IconBookmark size={18} />
                    )
                  }
                  variant={isInWatchlist ? 'filled' : 'outline'}
                  color="blue"
                  size="md"
                  onClick={handleToggleWatchlist}
                  className={styles.watchlistButton}
                >
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              </Tooltip>
            </Group>

            {/* 類型標籤 */}
            {movie.genres.length > 0 && (
              <Group gap="xs">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="light" size="md" radius="sm">
                    {genre.name}
                  </Badge>
                ))}
              </Group>
            )}

            {/* 宣傳標語 */}
            {movie.tagline && (
              <Text size="lg" fs="italic" className={styles.tagline}>
                "{movie.tagline}"
              </Text>
            )}

            {/* 劇情簡介 */}
            <div>
              <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="xs">
                Overview
              </Text>
              <Text size="md" className={styles.overview}>
                {movie.overview || 'No overview available'}
              </Text>
            </div>
          </Stack>
        </div>
      </Container>
    </div>
  );
}
