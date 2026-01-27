import { useParams } from 'react-router';
import { Container, Stack } from '@mantine/core';
import { useMovieDetail } from '@/features/movies/hooks/useMovieDetail';
import { useMovieReviews } from '@/features/movies/hooks/useMovieReviews';
import { MovieHero } from '@/features/movies/components/MovieHero';
import { MovieInfo } from '@/features/movies/components/MovieInfo';
import { CastSection } from '@/features/movies/components/CastSection';
import { VideosSection } from '@/features/movies/components/VideosSection';
import { ReviewsSection } from '@/features/movies/components/ReviewsSection';
import { LoadingState, ErrorState } from '@/components';
import styles from './MovieDetailPage.module.css';

/**
 * MovieDetailPage 元件
 *
 * 電影詳細頁面,顯示完整的電影資訊
 * 包含:
 * - 大型背景橫幅和基本資訊
 * - 詳細資訊(類型、片長、預算等)
 * - 演員陣容
 * - 預告片和影片
 * - 評論
 *
 * 路由參數:
 * - :id - 電影 ID
 */
export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const { movie, loading, error } = useMovieDetail(movieId);

  // 管理評論的分頁載入
  const {
    reviews,
    loading: reviewsLoading,
    hasMore,
    loadMore,
  } = useMovieReviews(
    movieId,
    movie?.reviews.reviews ?? [],
    movie?.reviews.page ?? 1,
    movie?.reviews.totalPages ?? 1
  );

  // 載入狀態
  if (loading) {
    return <LoadingState message="Loading movie details..." />;
  }

  // 錯誤狀態
  if (error) {
    return (
      <Container size="lg" py="xl">
        <ErrorState title="Failed to load movie" message={error.message} />
      </Container>
    );
  }

  // 找不到電影
  if (!movie) {
    return (
      <Container size="lg" py="xl">
        <ErrorState
          title="Movie not found"
          message="The movie you're looking for doesn't exist or has been removed."
        />
      </Container>
    );
  }

  return (
    <div className={styles.page}>
      {/* 大型背景橫幅區域 */}
      <MovieHero movie={movie} />

      {/* 主要內容區域 */}
      <Container size="lg" py="xl">
        <Stack gap="xl" px={{ base: 'md', sm: 'xl' }}>
          {/* 詳細資訊 */}
          <MovieInfo movie={movie} />

          {/* 演員陣容 */}
          {movie.cast.length > 0 && <CastSection cast={movie.cast} />}

          {/* 預告片和影片 */}
          {movie.videos.length > 0 && <VideosSection videos={movie.videos} />}

          {/* 評論 */}
          {reviews.length > 0 && (
            <ReviewsSection
              reviews={reviews}
              loading={reviewsLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          )}
        </Stack>
      </Container>
    </div>
  );
}
