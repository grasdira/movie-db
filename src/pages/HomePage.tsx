import { useState } from 'react';
import { Container, Title, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';
import { MovieSection } from '@/features/movies/components/MovieSection';
import { MovieDetailModal } from '@/features/movies/components/MovieDetailModal';
import type { Movie } from '@/features/movies/types/movie';

/**
 * HomePage 元件
 *
 * 應用程式的首頁,顯示多個電影分類區塊
 * 包含熱門電影、正在上映、高評分和即將上映等分類
 *
 * 狀態管理:
 * - selectedMovie: 當前被選中要顯示詳細資訊的電影
 * - 當使用者點擊電影卡片時,會開啟 Modal 顯示電影基本資訊
 */
export function HomePage() {
  const navigate = useNavigate();
  // 管理 Modal 的開啟/關閉狀態和選中的電影
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /**
   * 處理電影卡片點擊事件
   * 設定選中的電影,自動開啟 Modal
   */
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  /**
   * 關閉 Modal
   * 清除選中的電影
   */
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  /**
   * 前往電影詳細頁面
   *
   * 使用 React Router 的 navigate 導航到 /movie/:id 頁面
   */
  const handleViewDetail = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* 頁面標題 */}
          <Title order={1}>Movie Database</Title>

          {/* 熱門電影區塊 */}
          <MovieSection
            category="popular"
            title="Popular Movies"
            onMovieClick={handleMovieClick}
          />

          {/* 正在上映區塊 */}
          <MovieSection
            category="nowPlaying"
            title="Now Playing"
            onMovieClick={handleMovieClick}
          />

          {/* 高評分電影區塊 */}
          <MovieSection
            category="topRated"
            title="Top Rated"
            onMovieClick={handleMovieClick}
          />

          {/* 即將上映區塊 */}
          <MovieSection
            category="upcoming"
            title="Upcoming"
            onMovieClick={handleMovieClick}
          />
        </Stack>
      </Container>

      {/* 電影詳細資訊 Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        opened={selectedMovie !== null}
        onClose={handleCloseModal}
        onViewDetail={handleViewDetail}
      />
    </>
  );
}
