import { create } from 'zustand';
import { WatchlistService } from '@/features/watchlist/services/WatchlistService';
import type { WatchlistItem } from '@/features/watchlist/types/watchlist';

/**
 * Watchlist Store 的狀態介面
 */
interface WatchlistState {
  items: WatchlistItem[];
  count: number;
}

/**
 * Watchlist Store 的方法介面
 */
interface WatchlistActions {
  addToWatchlist: (movieId: number) => boolean;
  removeFromWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movieId: number) => boolean;
  clearWatchlist: () => void;
  isInWatchlist: (movieId: number) => boolean;
}

/**
 * 完整的 Store 介面
 */
type WatchlistStore = WatchlistState & WatchlistActions;

/**
 * 初始化載入 watchlist
 */
function loadInitialItems(): WatchlistItem[] {
  try {
    return WatchlistService.getAll();
  } catch (error) {
    console.error('Failed to load watchlist:', error);
    return [];
  }
}

/**
 * Watchlist Store
 *
 * 使用 Zustand 管理全域的 watchlist 狀態
 *
 * 重要: 所有方法都定義在 store 內部,確保引用穩定
 */
export const useWatchlistStore = create<WatchlistStore>((set, get) => {
  // 初始化
  const initialItems = loadInitialItems();

  return {
    // ========== State ==========
    items: initialItems,
    count: initialItems.length,

    // ========== Actions ==========

    /**
     * 檢查電影是否在 watchlist 中
     */
    isInWatchlist: (movieId: number): boolean => {
      return get().items.some((item) => item.movieId === movieId);
    },

    /**
     * 加入電影到 watchlist
     */
    addToWatchlist: (movieId: number): boolean => {
      try {
        // 先檢查是否已存在
        if (get().items.some((item) => item.movieId === movieId)) {
          return false;
        }

        const success = WatchlistService.add(movieId);

        if (success) {
          const newItems = WatchlistService.getAll();
          set({
            items: newItems,
            count: newItems.length,
          });
        }

        return success;
      } catch (error) {
        console.error('Failed to add to watchlist:', error);
        return false;
      }
    },

    /**
     * 從 watchlist 移除電影
     */
    removeFromWatchlist: (movieId: number): boolean => {
      try {
        const success = WatchlistService.remove(movieId);

        if (success) {
          const newItems = WatchlistService.getAll();
          set({
            items: newItems,
            count: newItems.length,
          });
        }

        return success;
      } catch (error) {
        console.error('Failed to remove from watchlist:', error);
        return false;
      }
    },

    /**
     * 切換電影的 watchlist 狀態
     */
    toggleWatchlist: (movieId: number): boolean => {
      const state = get();
      const inWatchlist = state.items.some((item) => item.movieId === movieId);

      if (inWatchlist) {
        state.removeFromWatchlist(movieId);
        return false;
      } else {
        state.addToWatchlist(movieId);
        return true;
      }
    },

    /**
     * 清空整個 watchlist
     */
    clearWatchlist: (): void => {
      try {
        WatchlistService.clear();
        set({ items: [], count: 0 });
      } catch (error) {
        console.error('Failed to clear watchlist:', error);
      }
    },
  };
});

// ========== Selector Hooks ==========

/**
 * 取得 watchlist 項目列表
 */
export const useWatchlistItems = () =>
  useWatchlistStore((state) => state.items);

/**
 * 取得 watchlist 項目數量
 */
export const useWatchlistCount = () =>
  useWatchlistStore((state) => state.count);

/**
 * 取得所有 watchlist 操作方法
 *
 * 注意: 這些方法的引用是穩定的,不會導致 re-render
 */
export const useWatchlistActions = () => {
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromWatchlist
  );
  const toggleWatchlist = useWatchlistStore((state) => state.toggleWatchlist);
  const clearWatchlist = useWatchlistStore((state) => state.clearWatchlist);
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  return {
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    isInWatchlist,
  };
};

/**
 * 檢查特定電影是否在 watchlist 中
 *
 * 注意: 這個 hook 使用了穩定的 selector
 */
export const useIsInWatchlist = (movieId: number) => {
  return useWatchlistStore((state) => {
    // 直接在 selector 中檢查,避免呼叫 isInWatchlist 方法
    return state.items.some((item) => item.movieId === movieId);
  });
};
