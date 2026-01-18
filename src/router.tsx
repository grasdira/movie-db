import { createBrowserRouter } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { Navigation } from '@/components/Navigation';

/**
 * 應用程式的路由配置
 *
 * 使用 React Router v7 的 createBrowserRouter API
 * 所有路由都包裹在 Navigation 元件中,提供一致的導航體驗
 *
 * 路由結構:
 * - / : 首頁,顯示各分類的電影列表
 * - /movie/:id : 電影詳細頁面 (待實作)
 * - /search : 搜尋頁面 (待實作)
 * - /watchlist : 待看清單頁面 (待實作)
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
        {/* //TODO: MovieDetailPage */}
        <div>Movie Detail Page - Coming Soon</div>
      </Navigation>
    ),
  },
  {
    path: '/search',
    element: (
      <Navigation>
        {/* //TODO: SearchPage */}
        <div>Search Page - Coming Soon</div>
      </Navigation>
    ),
  },
  {
    path: '/watchlist',
    element: (
      <Navigation>
        {/* //TODO: WatchlistPage */}
        <div>Watchlist Page - Coming Soon</div>
      </Navigation>
    ),
  },
]);
