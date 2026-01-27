import { Center, Stack, Text, Button, ThemeIcon } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  minHeight?: number;
}

/**
 * 錯誤狀態元件
 * 顯示錯誤訊息和可選的重試按鈕
 */
export function ErrorState({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  minHeight = 400,
}: ErrorStateProps) {
  return (
    <Center style={{ minHeight }}>
      <Stack align="center" gap="md" maw={400}>
        <ThemeIcon size={80} radius="xl" variant="light" color="red">
          <IconAlertCircle size={48} />
        </ThemeIcon>

        <Stack align="center" gap="xs">
          <Text size="xl" fw={600}>
            {title}
          </Text>
          <Text c="dimmed" ta="center">
            {message}
          </Text>
        </Stack>

        {onRetry && (
          <Button onClick={onRetry} variant="light">
            Try Again
          </Button>
        )}
      </Stack>
    </Center>
  );
}
