'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { LuMoon, LuSun } from 'react-icons/lu';

export function ColorModeButton() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        aria-label="Toggle color mode"
        variant="ghost"
        size="md"
        onClick={toggleColorMode}
      >
        {resolvedTheme === 'light' ? <LuMoon /> : <LuSun />}
      </IconButton>
    </ClientOnly>
  );
}
