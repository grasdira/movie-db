import { Title, SimpleGrid, AspectRatio, Badge, Text } from '@mantine/core';
import type { Video } from '@/features/movies/types/movie';
import styles from './VideosSection.module.css';

interface VideosSectionProps {
  videos: Video[];
}

/**
 * VideosSection 元件
 *
 * 顯示電影的預告片和相關影片
 * 使用嵌入式 YouTube 播放器
 */
export function VideosSection({ videos }: VideosSectionProps) {
  return (
    <div className={styles.section}>
      <Title order={2} size="h3" mb="md">
        Videos & Trailers
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {videos.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <AspectRatio ratio={16 / 9} className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.video}
              />
            </AspectRatio>
            <div className={styles.videoInfo}>
              <Text size="sm" fw={500} lineClamp={2} mb={4}>
                {video.name}
              </Text>
              <Badge size="xs" variant="light">
                {video.type}
              </Badge>
            </div>
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
}
