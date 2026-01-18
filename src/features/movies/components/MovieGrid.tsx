import { Group } from '@mantine/core';
import { MovieCard } from './MovieCard';
import type { Movie } from '@/features/movies/types/movie';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

/**
 * MovieGrid 元件
 *
 * 以橫向捲軸的方式顯示電影卡片列表
 * 適用於首頁的電影分類區塊,讓使用者可以快速瀏覽多部電影
 */
export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  return (
    <div className={styles.container}>
      <Group gap="md" wrap="nowrap" className={styles.scrollContainer}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick ? () => onMovieClick(movie) : undefined}
          />
        ))}
      </Group>
    </div>
  );
}
