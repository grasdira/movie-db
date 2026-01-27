import { Title, Avatar, Text, Group, Stack } from '@mantine/core';
import type { Cast } from '@/features/movies/types/movie';
import styles from './CastSection.module.css';

interface CastSectionProps {
  cast: Cast[];
}

/**
 * CastSection 元件
 *
 * 顯示電影的演員陣容
 * 使用橫向捲動的卡片佈局
 */
export function CastSection({ cast }: CastSectionProps) {
  return (
    <div className={styles.section}>
      <Title order={2} size="h3" mb="md">
        Cast
      </Title>

      <div className={styles.scrollContainer}>
        <Group gap="md" wrap="nowrap">
          {cast.map((member) => (
            <div key={member.id} className={styles.castCard}>
              <Avatar
                src={member.profileUrl}
                alt={member.name}
                size={150}
                variant="transparent"
                radius="md"
                className={styles.avatar}
              />
              <Stack gap={4} mt="sm">
                <Text size="sm" fw={600} lineClamp={1}>
                  {member.name}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {member.character}
                </Text>
              </Stack>
            </div>
          ))}
        </Group>
      </div>
    </div>
  );
}
