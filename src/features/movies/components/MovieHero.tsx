import { Container, Title, Text, Group, Badge, Stack } from '@mantine/core';
import { IconStarFilled, IconClock } from '@tabler/icons-react';
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
 */
export function MovieHero({ movie }: MovieHeroProps) {
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
      <Container size="xl" className={styles.content}>
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

            {/* 評分和基本資訊 */}
            <Group gap="md">
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
