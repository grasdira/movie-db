import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { Navigation } from '@/components/Navigation';
import { LoadingState } from '@/components';

// 動態載入所有頁面元件
// 使用 .then() 來處理 named export
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
);

const MovieDetailPage = lazy(() =>
  import('@/pages/MovieDetailPage').then((module) => ({
    default: module.MovieDetailPage,
  }))
);

const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((module) => ({
    default: module.SearchPage,
  }))
);

const WatchlistPage = lazy(() =>
  import('@/pages/WatchlistPage').then((module) => ({
    default: module.WatchlistPage,
  }))
);

/**
 * 應用程式的路由配置
 *
 * 使用 React Router v7 的 createBrowserRouter API
 * 所有路由都包裹在 Navigation 元件中,提供一致的導航體驗
 *
 * 效能優化:
 * - 使用 lazy() 進行程式碼分割,按需載入頁面
 * - Suspense 提供載入時的 fallback UI
 *
 * 路由結構:
 * - / : 首頁,顯示各分類的電影列表
 * - /movie/:id : 電影詳細頁面
 * - /search : 搜尋頁面
 * - /watchlist : 待看清單頁面
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Navigation>
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <HomePage />
        </Suspense>
      </Navigation>
    ),
  },
  {
    path: '/movie/:id',
    element: (
      <Navigation>
        <Suspense
          fallback={<LoadingState message="Loading movie details..." />}
        >
          <MovieDetailPage />
        </Suspense>
      </Navigation>
    ),
  },
  {
    path: '/search',
    element: (
      <Navigation>
        <Suspense fallback={<LoadingState message="Loading search..." />}>
          <SearchPage />
        </Suspense>
      </Navigation>
    ),
  },
  {
    path: '/watchlist',
    element: (
      <Navigation>
        <Suspense fallback={<LoadingState message="Loading watchlist..." />}>
          <WatchlistPage />
        </Suspense>
      </Navigation>
    ),
  },
]);
