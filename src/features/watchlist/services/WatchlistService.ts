import type {
  WatchlistData,
  WatchlistItem,
} from '@/features/watchlist/types/watchlist';

const STORAGE_KEY = 'movie-database-watchlist';
const CURRENT_VERSION = 1;

/**
 * WatchlistService
 *
 * 負責管理 Watchlist 的 localStorage 操作
 * 提供增刪查改的基本功能
 *
 * 設計考量:
 * 1. 使用版本號來支援未來的資料結構遷移
 * 2. 所有方法都是同步的,因為 localStorage 是同步 API
 * 3. 錯誤處理:如果 localStorage 不可用,回傳空資料
 * 4. 在加入項目前檢查重複,確保 movieId 的唯一性
 */
export class WatchlistService {
  /**
   * 初始化空的 watchlist 資料
   */
  private static getEmptyData(): WatchlistData {
    return {
      items: [],
      version: CURRENT_VERSION,
    };
  }

  /**
   * 從 localStorage 載入 watchlist
   *
   * @returns Watchlist 資料,如果載入失敗則回傳空資料
   */
  static load(): WatchlistData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getEmptyData();
      }

      const data = JSON.parse(stored) as WatchlistData;

      // 驗證資料結構
      if (!data.items || !Array.isArray(data.items)) {
        console.warn('Invalid watchlist data structure, resetting...');
        return this.getEmptyData();
      }

      // TODO: 未來如果版本不同,可以在這裡做資料遷移 (data migration)

      return data;
    } catch (error) {
      console.error('Failed to load watchlist:', error);
      return this.getEmptyData();
    }
  }

  /**
   * 儲存 watchlist 到 localStorage
   *
   * @param data - 要儲存的 watchlist 資料
   */
  private static save(data: WatchlistData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save watchlist:', error);
      // localStorage 可能因為空間不足或隱私模式而失敗
      // 這裡我們只記錄錯誤,不拋出異常
    }
  }

  /**
   * 加入電影到 watchlist
   *
   * @param movieId - 電影 ID
   * @returns true 如果成功加入,false 如果電影已存在
   */
  static add(movieId: number): boolean {
    const data = this.load();

    // 檢查是否已存在
    if (data.items.some((item) => item.movieId === movieId)) {
      return false;
    }

    // 加入新項目
    const newItem: WatchlistItem = {
      movieId,
      addedAt: new Date().toISOString(),
    };

    data.items.unshift(newItem); // 加到最前面,最新的在最上面
    this.save(data);
    return true;
  }

  /**
   * 從 watchlist 移除電影
   *
   * @param movieId - 電影 ID
   * @returns true 如果成功移除,false 如果電影不存在
   */
  static remove(movieId: number): boolean {
    const data = this.load();
    const originalLength = data.items.length;

    data.items = data.items.filter((item) => item.movieId !== movieId);

    if (data.items.length === originalLength) {
      return false; // 沒有找到要移除的項目
    }

    this.save(data);
    return true;
  }

  /**
   * 檢查電影是否在 watchlist 中
   *
   * @param movieId - 電影 ID
   * @returns true 如果電影在 watchlist 中
   */
  static has(movieId: number): boolean {
    const data = this.load();
    return data.items.some((item) => item.movieId === movieId);
  }

  /**
   * 取得所有 watchlist items
   *
   * @returns 所有 watchlist items，按加入時間排序(最新的在前)
   */
  static getAll(): WatchlistItem[] {
    const data = this.load();
    return [...data.items]; // 回傳副本,避免外部修改
  }

  /**
   * 取得 watchlist 的電影 ID 列表
   *
   * @returns 所有電影 ID
   */
  static getAllIds(): number[] {
    const data = this.load();
    return data.items.map((item) => item.movieId);
  }

  /**
   * 清空整個 watchlist
   */
  static clear(): void {
    this.save(this.getEmptyData());
  }

  /**
   * 取得 watchlist 的項目數量
   *
   * @returns 項目數量
   */
  static count(): number {
    const data = this.load();
    return data.items.length;
  }
}
