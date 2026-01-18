import {
  Modal,
  Image,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Title,
  Divider,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconWorld,
  IconBookmark,
  IconStarFilled,
} from '@tabler/icons-react';
import type { Movie } from '@/features/movies/types/movie';
import styles from './MovieDetailModal.module.css';

interface MovieDetailModalProps {
  movie: Movie | null;
  opened: boolean;
  onClose: () => void;
  onViewDetail?: (movieId: number) => void;
}

/**
 * MovieDetailModal 元件
 *
 * 當使用者點擊電影卡片時顯示的彈出視窗
 * 顯示電影的基本資訊,並提供前往詳細頁面的按鈕與新增至待看清單按鈕
 *
 */
export function MovieDetailModal({
  movie,
  opened,
  onClose,
  onViewDetail,
}: MovieDetailModalProps) {
  if (!movie) return null;

  const formattedRating = movie.rating.toFixed(1);
  const releaseYear = movie.releaseDate.split('-')[0];

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(movie.id);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      padding={0}
      radius="md"
      centered
      classNames={{
        body: styles.modalBody,
        content: styles.modalContent,
      }}
      withCloseButton={false}
      // scrollAreaComponent={ScrollArea.Autosize}
    >
      {/* 背景海報(模糊效果) */}
      <div className={styles.backdrop}>
        <div
          className={styles.backdropImage}
          style={{
            backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
          }}
        />
        <div className={styles.backdropOverlay} />
      </div>

      {/* //TODO 行動按鈕 - Add to watchlist */}
      <div className={styles.actionWrapper}>
        <Tooltip label="Add to watchlist">
          <ActionIcon
            variant="transparent"
            aria-label="Add to watchlist"
            size="xl"
          >
            <IconBookmark></IconBookmark>
          </ActionIcon>
        </Tooltip>
      </div>

      {/* 主要內容 */}
      <div className={styles.contentWrapper}>
        {/* 海報和基本資訊 */}
        <div className={styles.header}>
          <div className={styles.posterWrapper}>
            <Image
              src={movie.posterUrl || undefined}
              alt={movie.title}
              radius="md"
              className={styles.poster}
              fit="cover"
            />
          </div>

          <Stack gap="sm" className={styles.headerInfo}>
            <div>
              <Title order={2} size="h3" className={styles.title}>
                {movie.title}
              </Title>
              {movie.originalTitle !== movie.title && (
                <Text size="sm" c="dimmed" fs="italic" mt={4}>
                  {movie.originalTitle}
                </Text>
              )}
            </div>

            {/* 評分 */}
            <Group gap="xs" align="center">
              <div>
                <Badge
                  leftSection={<IconStarFilled size={16} />}
                  variant="outline"
                  color="yellow"
                  size="lg"
                  radius="md"
                >
                  {formattedRating}
                </Badge>
              </div>
              <Text size="sm" c="dimmed">
                {movie.voteCount.toLocaleString()} votes
              </Text>
            </Group>

            {/* 上映年份與語言 */}
            <Group gap="sm" mb="md">
              <Badge
                leftSection={<IconCalendar size={14} />}
                variant="light"
                size="lg"
                color="blue"
              >
                {releaseYear}
              </Badge>
              <Badge
                leftSection={<IconWorld size={14} />}
                variant="light"
                size="lg"
                color="grape"
              >
                {movie.originalLanguage.toUpperCase()}
              </Badge>
            </Group>
          </Stack>
        </div>

        <Divider my="md" size="xs" color="dimmed" />

        {/* 劇情簡介 */}
        <Stack gap="xs" mb="lg">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed">
            Overview
          </Text>
          <Text size="sm" className={styles.overview} lh={1.6}>
            {movie.overview || 'No overview available'}
          </Text>
        </Stack>

        {/* 行動按鈕 */}
        <Button
          size="md"
          onClick={handleViewDetail}
          fullWidth
          radius="md"
          variant="filled"
        >
          View Full Details
        </Button>
      </div>
    </Modal>
  );
}
