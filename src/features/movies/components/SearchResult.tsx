import { Stack } from '@mantine/core';
import type { Movie } from '@/features/movies/types/movie';
import { MovieListItem } from './MovieListItem';
import { LoadingState, ErrorState, EmptyState } from '@/components';
import { IconMoodSad } from '@tabler/icons-react';

interface SearchResultProps {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  query: string;
  onRetry: () => void;
}

/**
 * SearchResult 元件
 *
 * 處理搜尋結果的各種狀態顯示：
 * - 載入中（初次搜尋）
 * - 錯誤狀態
 * - 無結果
 * - 顯示結果列表
 */
export function SearchResult({
  movies,
  isLoading,
  error,
  query,
  onRetry,
}: SearchResultProps) {
  // 載入中（初次搜尋）
  if (isLoading && movies.length === 0) {
    return <LoadingState message="Searching for movies..." />;
  }

  // 錯誤狀態（且沒有任何結果）
  if (error && movies.length === 0) {
    return (
      <ErrorState
        title="Search failed"
        message={error.message}
        onRetry={onRetry}
      />
    );
  }

  // 空結果（搜尋完成但沒有結果）
  if (!isLoading && !error && movies.length === 0 && query) {
    return (
      <EmptyState
        icon={<IconMoodSad size={48} />}
        title="No results found"
        message="Try searching with different keywords or check your spelling"
      />
    );
  }

  // 顯示結果列表
  return (
    <Stack gap="md">
      {movies.map((movie) => (
        <MovieListItem key={movie.id} movie={movie} />
      ))}
    </Stack>
  );
}
