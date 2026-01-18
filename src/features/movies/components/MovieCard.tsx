import { Card, Image } from '@mantine/core';
import type { Movie } from '@/features/movies/types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

/**
 * MovieCard 元件
 *
 * 顯示單一電影的基本資訊,包括海報、標題和評分
 */
export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <Card
      className={styles.card}
      shadow="sm"
      padding="0"
      radius="md"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 電影海報 */}
      <Card.Section>
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          height={300}
          fallbackSrc="https://placehold.co/200x300?text=No+Image"
        />
      </Card.Section>
    </Card>
  );
}
