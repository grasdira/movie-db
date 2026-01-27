import {
  Paper,
  Image,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconStar,
  IconBookmark,
  IconBookmarkFilled,
  IconEye,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import {
  useIsInWatchlist,
  useWatchlistActions,
} from '@/features/watchlist/store';
import { notifications } from '@mantine/notifications';
import type { Movie } from '@/features/movies/types/movie';
import styles from './MovieListItem.module.css';

interface MovieListItemProps {
  movie: Movie;
}

/**
 * MovieListItem 元件
 *
 * 用於搜尋結果的列表顯示
 */
export function MovieListItem({ movie }: MovieListItemProps) {
  const navigate = useNavigate();
  const isInWatchlist = useIsInWatchlist(movie.id);
  const { toggleWatchlist } = useWatchlistActions();

  /**
   * 格式化上映年份
   * 從完整的日期字串中提取年份
   */
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : 'N/A';

  /**
   * 格式化評分
   * 顯示一位小數
   */
  const formattedRating = movie.rating.toFixed(1);

  /**
   * 處理加入/移除 Watchlist
   */
  const handleToggleWatchlist = (e: React.MouseEvent) => {
    // 防止事件冒泡到父元素
    e.stopPropagation();

    const added = toggleWatchlist(movie.id);

    // 顯示 Toast notification
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

  /**
   * 處理查看詳情
   */
  const handleViewDetail = () => {
    navigate(`/movie/${movie.id}`);
  };

  /**
   * 評分的視覺呈現
   * 根據評分高低使用不同的顏色
   */
  const getRatingColor = (rating: number): string => {
    if (rating >= 7.5) return 'green';
    if (rating >= 6.0) return 'yellow';
    return 'orange';
  };

  return (
    <Paper shadow="sm" radius="md" withBorder className={styles.container}>
      <Group wrap="nowrap" align="center" gap="md">
        {/* 海報圖片 */}
        <div className={styles.posterWrapper}>
          <Image
            src={movie.posterUrl || undefined}
            alt={movie.title}
            className={styles.poster}
            fallbackSrc="https://via.placeholder.com/150x225?text=No+Image"
          />
        </div>

        {/* 電影資訊 */}
        <Stack gap="xs" className={styles.content}>
          {/* 標題和年份 */}
          <div>
            <Group gap="xs" align="center">
              <Text size="lg" fw={600} className={styles.title}>
                {movie.title}
              </Text>
              <Text size="sm" c="dimmed">
                ({releaseYear})
              </Text>
            </Group>
            {/* 原文標題(如果與主標題不同) */}
            {movie.originalTitle !== movie.title && (
              <Text size="xs" c="dimmed" fs="italic" mt={2}>
                {movie.originalTitle}
              </Text>
            )}
          </div>

          {/* 評分 */}
          <Group gap="sm">
            <Badge
              leftSection={<IconStar size={14} />}
              color={getRatingColor(movie.rating)}
              variant="light"
              size="md"
            >
              {formattedRating}
            </Badge>
            <Text size="sm" c="dimmed">
              {movie.voteCount.toLocaleString()} votes
            </Text>
          </Group>

          {/* 簡介 */}
          <Text size="sm" c="dimmed" lineClamp={3} className={styles.overview}>
            {movie.overview || 'No overview available.'}
          </Text>

          {/* 操作按鈕 */}
          <Group gap="sm" mt="auto">
            {/* 查看詳情按鈕 - 主要操作 */}
            <Button
              leftSection={<IconEye size={18} />}
              onClick={handleViewDetail}
              size="sm"
              variant="filled"
            >
              View Details
            </Button>

            {/* Watchlist 按鈕 - 次要操作 */}
            <Tooltip
              label={
                isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
              }
            >
              <ActionIcon
                size="lg"
                variant={isInWatchlist ? 'filled' : 'light'}
                color={isInWatchlist ? 'blue' : 'gray'}
                onClick={handleToggleWatchlist}
                aria-label={
                  isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
                }
              >
                {isInWatchlist ? (
                  <IconBookmarkFilled size={20} />
                ) : (
                  <IconBookmark size={20} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}
