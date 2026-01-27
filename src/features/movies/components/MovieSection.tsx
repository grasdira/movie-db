import { Title, Stack } from '@mantine/core';
import { useMovieList } from '@/features/movies/hooks/useMovieList';
import { MovieGrid } from './MovieGrid';
import { LoadingState, ErrorState, EmptyState } from '@/components';
import type { MovieCategory, Movie } from '@/features/movies/types/movie';
import styles from './MovieSection.module.css';

interface MovieSectionProps {
  category: MovieCategory;
  title: string;
  onMovieClick?: (movie: Movie) => void;
}

/**
 * MovieSection 元件
 *
 * 顯示特定分類的電影區塊，包含標題和電影列表
 * 負責處理資料載入、錯誤顯示等狀態
 */
export function MovieSection({
  category,
  title,
  onMovieClick,
}: MovieSectionProps) {
  const { movies, loading, error } = useMovieList(category);

  return (
    <Stack gap="md" className={styles.section}>
      {/* 區塊標題 */}
      <Title order={2} size="h3">
        {title}
      </Title>

      {/* 載入狀態 */}
      {loading && (
        <LoadingState
          message={`Loading ${title.toLowerCase()}...`}
          minHeight={200}
        />
      )}

      {/* 錯誤狀態 */}
      {error && !loading && (
        <ErrorState
          title="Failed to load movies"
          message={error.message}
          minHeight={200}
        />
      )}

      {/* 空狀態 */}
      {!loading && !error && movies.length === 0 && (
        <EmptyState
          title="No movies available"
          message={`No ${title.toLowerCase()} movies found at the moment.`}
          minHeight={200}
        />
      )}

      {/* 電影列表 */}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={onMovieClick} />
      )}
    </Stack>
  );
}
