'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { LuMoon, LuSun } from 'react-icons/lu';

export function ColorModeButton() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        aria-label={t('common.toggleColorMode')}
        variant="ghost"
        size="md"
        onClick={toggleColorMode}
      >
        {resolvedTheme === 'light' ? <LuMoon /> : <LuSun />}
      </IconButton>
    </ClientOnly>
  );
}
