import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingStateProps {
  message?: string;
  minHeight?: number;
}

/**
 * 載入狀態元件
 * 顯示載入動畫和可選的訊息
 */
export function LoadingState({
  message = 'Loading...',
  minHeight = 400,
}: LoadingStateProps) {
  return (
    <Center style={{ minHeight }}>
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
