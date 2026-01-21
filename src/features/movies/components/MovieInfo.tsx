import { Paper, Title, Text, SimpleGrid, Divider, Stack } from '@mantine/core';
import type { MovieDetail } from '@/features/movies/types/movie';
import styles from './MovieInfo.module.css';

interface MovieInfoProps {
  movie: MovieDetail;
}

/**
 * MovieInfo 元件
 *
 * 顯示電影的詳細資訊和關鍵劇組人員
 * 包含:
 * - 狀態、預算、票房等資訊
 * - 導演、編劇、製片人等關鍵人員
 */
export function MovieInfo({ movie }: MovieInfoProps) {
  // 格式化貨幣
  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 按職位分組劇組人員
  const directors = movie.crew.filter((member) => member.job === 'Director');
  const writers = movie.crew.filter(
    (member) => member.job === 'Screenplay' || member.job === 'Writer'
  );
  const producers = movie.crew.filter((member) => member.job === 'Producer');

  return (
    <Paper p="xl" radius="md" withBorder className={styles.paper}>
      <Stack gap="lg">
        <Title order={2} size="h3">
          Movie Information
        </Title>

        <Divider />

        {/* 基本資訊 */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Status
            </Text>
            <Text size="md">{movie.status}</Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Release Date
            </Text>
            <Text size="md">
              {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Original Language
            </Text>
            <Text size="md" tt="uppercase">
              {movie.originalLanguage}
            </Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Budget
            </Text>
            <Text size="md">{formatCurrency(movie.budget)}</Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Revenue
            </Text>
            <Text size="md">{formatCurrency(movie.revenue)}</Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Runtime
            </Text>
            <Text size="md">
              {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}
            </Text>
          </div>
        </SimpleGrid>

        {/* 劇組人員 */}
        {(directors.length > 0 ||
          writers.length > 0 ||
          producers.length > 0) && (
          <>
            <Divider />
            <div>
              <Title order={3} size="h4" mb="md">
                Key Crew
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {/* 導演 */}
                {directors.length > 0 && (
                  <div>
                    <Text size="sm" fw={600} c="dimmed" mb={4}>
                      Director{directors.length > 1 ? 's' : ''}
                    </Text>
                    <Stack gap={4}>
                      {directors.map((director) => (
                        <Text key={director.id} size="md">
                          {director.name}
                        </Text>
                      ))}
                    </Stack>
                  </div>
                )}

                {/* 編劇 */}
                {writers.length > 0 && (
                  <div>
                    <Text size="sm" fw={600} c="dimmed" mb={4}>
                      Writer{writers.length > 1 ? 's' : ''}
                    </Text>
                    <Stack gap={4}>
                      {writers.slice(0, 3).map((writer) => (
                        <Text key={writer.id} size="md">
                          {writer.name}
                        </Text>
                      ))}
                    </Stack>
                  </div>
                )}

                {/* 製片人 */}
                {producers.length > 0 && (
                  <div>
                    <Text size="sm" fw={600} c="dimmed" mb={4}>
                      Producer{producers.length > 1 ? 's' : ''}
                    </Text>
                    <Stack gap={4}>
                      {producers.slice(0, 3).map((producer) => (
                        <Text key={producer.id} size="md">
                          {producer.name}
                        </Text>
                      ))}
                    </Stack>
                  </div>
                )}
              </SimpleGrid>
            </div>
          </>
        )}
      </Stack>
    </Paper>
  );
}
