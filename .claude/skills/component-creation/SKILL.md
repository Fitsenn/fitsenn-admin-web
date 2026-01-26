# Component Creation Skill

**Rule Tag**: `COMPONENT`

## Critical Rules

1. **NO hardcoded text** - ALL user-facing strings use `t()` function
2. **NO `any` types** - Properly type all props and state
3. **NO default exports** - Always use named exports
4. **NO relative imports** outside component folder - Use `@/` prefix
5. **ALWAYS use Chakra UI** components for layout and styling
6. **ALWAYS support dark/light mode** via Chakra semantic tokens

## Component Categories

### Feature Components
Location: `features/[feature]/components/`
- Page components (e.g., `users-page.tsx`)
- Feature-specific UI (e.g., `users-table.tsx`)

### Shared Components
Location: `components/`
- Reusable across features
- UI primitives and wrappers

## Templates

See `templates/` folder for:
- `page.tsx` - Feature page component
- `component.tsx` - Generic component
- `table.tsx` - Data table component

## Localization Pattern

```typescript
import { useTranslation } from 'react-i18next'

const Component = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading>{t('feature.title')}</Heading>
      <Text>{t('feature.description')}</Text>
      {/* For interpolation */}
      <Text>{t('feature.greeting', { name: user.name })}</Text>
    </Box>
  )
}
```

## Chakra UI Patterns

### Layout
```typescript
import { Box, Stack, Flex, Grid } from '@chakra-ui/react'

// Vertical stack with gap
<Stack gap={6}>...</Stack>

// Horizontal layout
<Flex justify="space-between" align="center">...</Flex>
```

### Typography
```typescript
import { Heading, Text } from '@chakra-ui/react'

<Heading size="xl">{t('title')}</Heading>
<Text color="fg.muted">{t('description')}</Text>
```

### Colors (Semantic)
```typescript
// Use semantic tokens for dark/light mode support
color="fg.muted"      // Muted foreground
color="fg.subtle"     // Subtle foreground
bg="bg.subtle"        // Subtle background
colorPalette="brand"  // Brand colors
```

## Loading States

```typescript
import { Spinner, Skeleton } from '@chakra-ui/react'

// Simple loading
if (isLoading) return <Spinner />

// Skeleton for layout
if (isLoading) return <Skeleton height="200px" />
```

## Error States

```typescript
import { Alert } from '@chakra-ui/react'

if (error) {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>{t('common.error')}</Alert.Title>
      <Alert.Description>{error.message}</Alert.Description>
    </Alert.Root>
  )
}
```

## Checklist

- [ ] Component follows standard structure (imports → types → component → export)
- [ ] All text uses `t()` function
- [ ] Translation keys added to `locales/en.json` and `locales/ro.json`
- [ ] Uses Chakra UI components
- [ ] Props properly typed (no `any`)
- [ ] Named export
- [ ] Absolute imports with `@/`
- [ ] File under 300 lines
- [ ] Handles loading state
- [ ] Handles error state
