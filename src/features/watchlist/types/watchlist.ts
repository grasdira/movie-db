/**
 * Watchlist item
 * 儲存在 localStorage 中的資料結構
 */
export interface WatchlistItem {
  movieId: number;
  addedAt: string; // ISO date string
}

/**
 * Watchlist 在 localStorage 中的完整資料結構
 */
export interface WatchlistData {
  items: WatchlistItem[];
  /**
   * 資料格式版本號
   *
   * 目前版本: 1
   *
   * 這個欄位用於未來的資料遷移。當我們需要改變 WatchlistItem
   * 的資料結構時(例如加入新欄位),可以透過版本號來判斷資料是
   * 舊格式還是新格式,並進行適當的轉換。
   *
   * 雖然目前的實作中沒有使用這個欄位,但預先加入它的成本很低,
   * 而未來如果需要資料遷移時,它會變得非常有價值。
   *
   * @example
   * // 未來的遷移邏輯可能像這樣:
   * if (data.version === 1) {
   *   return migrateFromV1ToV2(data);
   * }
   */
  version: number; // 用於未來的資料遷移 (data migration)
}
