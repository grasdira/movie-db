import {
  Title,
  Paper,
  Avatar,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  Center,
  Loader,
} from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import type { Review } from '@/features/movies/types/movie';
import styles from './ReviewsSection.module.css';

interface ReviewsSectionProps {
  reviews: Review[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * ReviewsSection 元件
 *
 * 顯示電影的評論，支援分頁載入
 * 每則評論包含作者資訊、評分和內容
 * 使用者可以透過「Load More」按鈕載入更多評論
 */
export function ReviewsSection({
  reviews,
  loading = false,
  hasMore = false,
  onLoadMore,
}: ReviewsSectionProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.section}>
      <Title order={2} size="h3" mb="md">
        Reviews
      </Title>

      <Stack gap="md">
        {reviews.map((review) => (
          <Paper
            key={review.id}
            p="lg"
            radius="md"
            withBorder
            className={styles.reviewCard}
          >
            {/* 評論頭部 */}
            <Group justify="space-between" mb="md" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  src={review.avatarUrl}
                  alt={review.author}
                  size="md"
                  radius="xl"
                />
                <div>
                  <Text size="sm" fw={600}>
                    {review.author}
                  </Text>
                  <Text size="xs" c="dimmed">
                    @{review.authorUsername}
                  </Text>
                </div>
              </Group>
              {review.rating && (
                <Badge
                  leftSection={<IconStarFilled size={12} />}
                  variant="filled"
                  color="yellow"
                  className={styles.ratingBadge}
                >
                  {review.rating.toFixed(1)}
                </Badge>
              )}
            </Group>

            {/* 評論內容 */}
            <Text size="sm" className={styles.content}>
              {review.content}
            </Text>

            {/* 日期 */}
            <Text size="xs" c="dimmed" mt="sm">
              {formatDate(review.createdAt)}
            </Text>
          </Paper>
        ))}

        {/* 載入更多按鈕 */}
        {hasMore && onLoadMore && (
          <Center mt="md">
            <Button
              variant="light"
              onClick={onLoadMore}
              loading={loading}
              disabled={loading}
            >
              Load More Reviews
            </Button>
          </Center>
        )}

        {/* 載入中指示器 */}
        {loading && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}

        {/* 沒有更多評論的提示 */}
        {!hasMore && reviews.length > 0 && !loading && (
          <Center py="md">
            <Text size="sm" c="dimmed">
              No more reviews
            </Text>
          </Center>
        )}
      </Stack>
    </div>
  );
}
