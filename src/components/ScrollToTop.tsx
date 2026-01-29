import { useMemo } from 'react';
import { ActionIcon, Transition, Tooltip } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';

interface ScrollToTopProps {
  /**
   * 顯示按鈕的滾動距離閾值（px）
   */
  threshold?: number;
}

/**
 * ScrollToTop 元件
 *
 * 當使用者向下滾動超過特定距離時，顯示「返回頂部」按鈕
 */
export function ScrollToTop({ threshold = 300 }: ScrollToTopProps) {
  const [scroll] = useWindowScroll();

  const isVisible = useMemo(() => scroll.y > threshold, [scroll.y, threshold]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Transition
      mounted={isVisible}
      transition="slide-up"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <Tooltip label="Back to top" position="left">
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color="blue"
            onClick={handleScrollToTop}
            style={{
              ...styles,
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 100,
              boxShadow: 'var(--mantine-shadow-lg)',
            }}
            aria-label="Scroll to top"
          >
            <IconArrowUp size={20} />
          </ActionIcon>
        </Tooltip>
      )}
    </Transition>
  );
}
