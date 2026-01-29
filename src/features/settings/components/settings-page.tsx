import {
  Box,
  Fieldset,
  HStack,
  Heading,
  Icon,
  Portal,
  Select,
  Span,
  Stack,
  Text,
  createListCollection,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Check, Monitor, Moon, Sun } from 'lucide-react';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useTimezone } from '@/hooks/use-timezone';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n';

const SettingsPage = () => {
  const [, setStoredLanguage] = useLocalStorage(LANGUAGE_STORAGE_KEY, 'ro');

  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { timezone, setTimezone } = useTimezone();

  const themeOptions = createListCollection({
    items: [
      { label: t('settings.themeLight'), value: 'light', icon: <Sun /> },
      { label: t('settings.themeDark'), value: 'dark', icon: <Moon /> },
      {
        label: t('settings.themeSystem'),
        value: 'system',
        icon: <Monitor />,
        description: t('settings.themeSystemDescription'),
      },
    ],
  });

  const languageOptions = createListCollection({
    items: [
      { label: t('settings.languageEnglish'), value: 'en' },
      { label: t('settings.languageRomanian'), value: 'ro' },
    ],
  });

  const timezoneOptions = createListCollection({
    items: [
      { label: t('settings.timezoneBucharest'), value: 'Europe/Bucharest' },
      { label: t('settings.timezoneUTC'), value: 'UTC' },
    ],
  });

  const handleThemeChange = (details: { value: string[] }) => {
    setTheme(details.value[0]);
  };

  const handleLanguageChange = (details: { value: string[] }) => {
    const newLanguage = details.value[0];
    i18n.changeLanguage(newLanguage);
    setStoredLanguage(newLanguage);
  };

  const handleTimezoneChange = (details: { value: string[] }) => {
    setTimezone(details.value[0]);
  };

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('settings.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('settings.description')}
        </Text>
      </Box>

      <Stack gap={8}>
        <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg">
          <Fieldset.Root>
            <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
              {t('settings.appearance')}
            </Fieldset.Legend>
            <Fieldset.Content>
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium">{t('settings.theme')}</Text>
                  <Text color="fg.muted" mt={2}>
                    {t('settings.themeDescription')}
                  </Text>
                </Box>
                <Select.Root
                  collection={themeOptions}
                  size="sm"
                  width="240px"
                  value={[theme ?? 'system']}
                  onValueChange={handleThemeChange}>
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {themeOptions.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <HStack gap={2} flex={1}>
                              <Icon boxSize={4}>{item.icon}</Icon>
                              <Stack gap={0}>
                                <Select.ItemText>{item.label}</Select.ItemText>
                                {item.description && (
                                  <Span color="fg.muted" textStyle="xs">
                                    {item.description}
                                  </Span>
                                )}
                              </Stack>
                            </HStack>
                            <Select.ItemIndicator>
                              <Check />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </HStack>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>

        <Box bg={{ base: 'gray.50', _dark: 'gray.900' }} p={6} borderRadius="lg">
          <Fieldset.Root>
            <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
              {t('settings.languageRegion')}
            </Fieldset.Legend>
            <Fieldset.Content>
              <Stack gap={6}>
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">{t('settings.language')}</Text>
                    <Text color="fg.muted" mt={2}>
                      {t('settings.languageDescription')}
                    </Text>
                  </Box>
                  <Select.Root
                    collection={languageOptions}
                    size="sm"
                    width="240px"
                    value={[i18n.language]}
                    onValueChange={handleLanguageChange}>
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {languageOptions.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              <Select.ItemText>{item.label}</Select.ItemText>
                              <Select.ItemIndicator>
                                <Check />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </HStack>

                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">{t('settings.timezone')}</Text>
                    <Text color="fg.muted" mt={2}>
                      {t('settings.timezoneDescription')}
                    </Text>
                  </Box>
                  <Select.Root
                    collection={timezoneOptions}
                    size="sm"
                    width="240px"
                    value={[timezone]}
                    onValueChange={handleTimezoneChange}>
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {timezoneOptions.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              <Select.ItemText>{item.label}</Select.ItemText>
                              <Select.ItemIndicator>
                                <Check />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </HStack>
              </Stack>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>
      </Stack>
    </Stack>
  );
};

export { SettingsPage };
