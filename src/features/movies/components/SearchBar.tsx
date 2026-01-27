import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

/**
 * SearchBar 元件
 *
 * 搜尋輸入框，包含清除按鈕
 */
export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <TextInput
      placeholder="Search for movies..."
      size="lg"
      leftSection={<IconSearch size={20} />}
      rightSection={
        value && (
          <ActionIcon
            variant="subtle"
            onClick={onClear}
            aria-label="Clear search"
          >
            <IconX size={20} />
          </ActionIcon>
        )
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
