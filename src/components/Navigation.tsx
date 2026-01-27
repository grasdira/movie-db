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
  TextInput,
  Switch,
  Text,
} from '@mantine/core';
import {
  IconHome,
  IconSearch,
  IconBookmark,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router';
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
 * - 搜尋功能（所有裝置都顯示，但在搜尋頁面隱藏）
 * - 主要導航連結(首頁、待看清單)
 * - 主題切換按鈕（桌面版在導航列，手機版在 Drawer）
 * - 響應式設計:桌面版顯示完整導航列,行動版使用漢堡選單
 */
export function Navigation({ children }: NavigationProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * 檢查是否在搜尋頁面
   */
  const isSearchPage = location.pathname === '/search';

  /**
   * 切換主題
   * Light <-> Dark
   */
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  /**
   * 處理搜尋
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  /**
   * 導航項目配置
   */
  const navItems = [
    { to: '/', label: 'Home', icon: IconHome },
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

          {/* Search Bar - 在搜尋頁面時隱藏 */}
          {!isSearchPage && (
            <form
              onSubmit={handleSearch}
              style={{ flex: 1, maxWidth: '400px' }}
            >
              <TextInput
                placeholder="Search movies..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                size="sm"
              />
            </form>
          )}

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
            {/* Theme Toggle - 只在桌面版顯示 */}
            <Tooltip
              label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
              position="bottom"
              visibleFrom="sm"
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={toggleColorScheme}
                aria-label="Toggle color scheme"
                visibleFrom="sm"
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
          {/* Navigation Links */}
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

          {/* Theme Toggle - 在 Drawer 底部 */}
          <Group justify="space-between" mt="md" p="sm">
            <Group gap="xs">
              {colorScheme === 'dark' ? (
                <IconMoon size={18} />
              ) : (
                <IconSun size={18} />
              )}
              <Text size="sm">
                {colorScheme === 'dark' ? 'Dark mode' : 'Light mode'}
              </Text>
            </Group>
            <Switch
              checked={colorScheme === 'dark'}
              onChange={toggleColorScheme}
              size="md"
            />
          </Group>
        </Stack>
      </Drawer>

      {/* Main Content */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
