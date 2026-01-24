import { createBrowserRouter } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { MovieDetailPage } from '@/pages/MovieDetailPage';
import { WatchlistPage } from '@/pages/WatchlistPage';
import { Navigation } from '@/components/Navigation';
import { SearchPage } from '@/pages/SearchPage';

/**
 * 應用程式的路由配置
 *
 * 使用 React Router v7 的 createBrowserRouter API
 * 所有路由都包裹在 Navigation 元件中,提供一致的導航體驗
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
        <HomePage />
      </Navigation>
    ),
  },
  {
    path: '/movie/:id',
    element: (
      <Navigation>
        <MovieDetailPage />
      </Navigation>
    ),
  },
  {
    path: '/search',
    element: (
      <Navigation>
        <SearchPage />
      </Navigation>
    ),
  },
  {
    path: '/watchlist',
    element: (
      <Navigation>
        <WatchlistPage />
      </Navigation>
    ),
  },
]);
