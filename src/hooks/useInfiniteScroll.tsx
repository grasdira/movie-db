import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;

  /**
   * 距離底部多少 px 時觸發載入（預設 300px）
   */
  threshold?: number;

  /**
   * Throttle 間隔（ms），防止過於頻繁觸發（預設 200ms）
   */
  throttleMs?: number;
}

/**
 * useInfiniteScroll Hook
 *
 * 使用 scroll 事件實作無限滾動
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 300,
  throttleMs = 200,
}: UseInfiniteScrollOptions) {
  const lastTriggerRef = useRef(0);

  const handleScroll = useCallback(() => {
    // 如果正在載入或沒有更多資料，直接返回
    if (isLoading || !hasMore) {
      return;
    }

    // Throttle: 如果距離上次觸發時間太短，跳過
    const now = Date.now();
    if (now - lastTriggerRef.current < throttleMs) {
      return;
    }

    // 計算滾動位置
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 距離底部的距離
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

    // 如果距離底部小於閾值，觸發載入
    if (distanceFromBottom < threshold) {
      console.log('[useInfiniteScroll] Triggering loadMore', {
        distanceFromBottom,
        threshold,
      });

      lastTriggerRef.current = now;
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isLoading, threshold, throttleMs]);

  useEffect(() => {
    // 使用 passive 提升滾動效能
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
}
