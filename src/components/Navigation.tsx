import { useState } from 'react';
import {
  AppShell,
  Group,
  Title,
  ActionIcon,
  Tooltip,
  Burger,
  Drawer,
  Stack,
  NavLink,
} from '@mantine/core';
import {
  IconHome,
  IconSearch,
  IconBookmark,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router';
import { useMantineColorScheme } from '@mantine/core';
import styles from './Navigation.module.css';

interface NavigationProps {
  children: React.ReactNode;
}

/**
 * Navigation 元件
 *
 * 應用程式的主要導航系統,包含:
 * - Logo 和應用程式標題
 * - 主要導航連結(首頁、搜尋、待看清單)
 * - 主題切換按鈕
 * - 響應式設計:桌面版顯示完整導航列,行動版使用漢堡選單
 */
export function Navigation({ children }: NavigationProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const location = useLocation();

  /**
   * 切換主題
   * Light <-> Dark
   */
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  /**
   * 導航項目配置
   */
  const navItems = [
    { to: '/', label: 'Home', icon: IconHome },
    { to: '/search', label: 'Search', icon: IconSearch },
    { to: '/watchlist', label: 'Watchlist', icon: IconBookmark },
  ];

  /**
   * 檢查是否為當前路由
   */
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppShell header={{ height: 60 }}>
      {/* Header */}
      <AppShell.Header p="sm">
        <Group h="100%" px="md" justify="space-between">
          {/* Logo & Title */}
          <Group gap="sm">
            <Link to="/" className={styles.logoLink}>
              <Title order={3} className={styles.logo}>
                🎬 Movie DB
              </Title>
            </Link>
          </Group>

          {/* Desktop Navigation */}
          <Group gap="md" visibleFrom="sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navLink} ${isActive(item.to) ? styles.active : ''}`}
              >
                <Group gap="xs">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Group>
              </Link>
            ))}
          </Group>

          {/* Actions */}
          <Group gap="xs">
            {/* Theme Toggle */}
            <Tooltip
              label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
              position="bottom"
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleColorScheme}
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? (
                  <IconSun size={20} />
                ) : (
                  <IconMoon size={20} />
                )}
              </ActionIcon>
            </Tooltip>

            {/* Mobile Menu Burger */}
            <Burger
              opened={drawerOpened}
              onClick={() => setDrawerOpened(!drawerOpened)}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </Group>
      </AppShell.Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        size="xs"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
      >
        <Stack gap="xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              leftSection={<item.icon size={18} />}
              active={isActive(item.to)}
              onClick={() => setDrawerOpened(false)}
            />
          ))}
        </Stack>
      </Drawer>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
