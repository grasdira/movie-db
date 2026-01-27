import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconMoodEmpty } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  minHeight?: number;
}

/**
 * 空狀態元件
 * 用於顯示「無資料」的情況
 */
export function EmptyState({
  title = 'No results found',
  message,
  icon,
  action,
  minHeight = 400,
}: EmptyStateProps) {
  return (
    <Center style={{ minHeight }}>
      <Stack align="center" gap="md" maw={400}>
        <ThemeIcon size={80} radius="xl" variant="light" color="gray">
          {icon || <IconMoodEmpty size={48} />}
        </ThemeIcon>

        <Stack align="center" gap="xs">
          <Text size="xl" fw={600}>
            {title}
          </Text>
          <Text c="dimmed" ta="center">
            {message}
          </Text>
        </Stack>

        {action}
      </Stack>
    </Center>
  );
}
