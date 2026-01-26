# UI Standards

**Rule Tag**: `UI`

## 13 Core Principles

1. **Chakra UI Components** - Use Chakra for all layout and styling
2. **Semantic Color Tokens** - Use `fg.muted`, `bg.subtle`, etc. for dark/light mode
3. **Brand Colors** - Use `colorPalette="brand"` for brand styling
4. **useTranslation** - All user-facing text via `t()` function
5. **Named Exports** - No default exports
6. **Absolute Imports** - Use `@/` prefix for all non-relative imports
7. **Loading States** - Always show Spinner or Skeleton
8. **Error States** - Always show Alert component
9. **Type Safety** - No `any` types
10. **File Size** - Max 300 lines per file
11. **Component Structure** - Follow standard order
12. **Accessibility** - Labels, aria attributes, focus management
13. **Responsive Design** - Mobile-first with Chakra breakpoints

## Page Structure Pattern

```typescript
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const FeaturePage = () => {
  const { t } = useTranslation()

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl">{t('feature.title')}</Heading>
        <Text color="fg.muted" mt={2}>
          {t('feature.description')}
        </Text>
      </Box>
      <Box>{/* Feature content */}</Box>
    </Stack>
  )
}

export { FeaturePage }
```

## Chakra UI v3 Patterns

### Color Tokens
```typescript
// Foreground
color="fg"           // Default text
color="fg.muted"     // Secondary text
color="fg.subtle"    // Tertiary text

// Background
bg="bg"              // Default background
bg="bg.subtle"       // Subtle background

// Brand
colorPalette="brand" // Brand color palette
```

### Component Patterns

#### Buttons
```typescript
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button colorPalette="brand">Brand</Button>
<Button loading loadingText="Saving...">Save</Button>
```

#### Cards
```typescript
<Card.Root>
  <Card.Header>
    <Card.Title>{t('title')}</Card.Title>
  </Card.Header>
  <Card.Body>{/* content */}</Card.Body>
  <Card.Footer>{/* actions */}</Card.Footer>
</Card.Root>
```

#### Alerts
```typescript
<Alert.Root status="error">
  <Alert.Indicator />
  <Alert.Title>{t('error.title')}</Alert.Title>
  <Alert.Description>{error.message}</Alert.Description>
</Alert.Root>
```

#### Dialogs
```typescript
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>{t('openDialog')}</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{t('dialogTitle')}</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>{/* Content */}</Dialog.Body>
    <Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <Button variant="outline">{t('cancel')}</Button>
      </Dialog.CloseTrigger>
      <Button>{t('confirm')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## State Handling

### Loading
```typescript
if (isLoading) return <Spinner />
// or for layout
if (isLoading) return <Skeleton height="200px" />
```

### Error
```typescript
if (error) {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>{t('common.error')}</Alert.Title>
    </Alert.Root>
  )
}
```

### Empty
```typescript
if (data.length === 0) {
  return (
    <Box textAlign="center" py={10}>
      <Text color="fg.muted">{t('common.noData')}</Text>
    </Box>
  )
}
```

## Responsive Breakpoints

```typescript
<Box
  width={{ base: '100%', md: '50%', lg: '33%' }}
  p={{ base: 4, md: 6 }}
>
```

| Breakpoint | Min Width |
|------------|-----------|
| base | 0px |
| sm | 480px |
| md | 768px |
| lg | 992px |
| xl | 1280px |

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Hardcode text | Use `t()` |
| Inline colors | Semantic tokens |
| Custom CSS | Chakra props |
| Default exports | Named exports |
| Skip loading state | Spinner/Skeleton |
| Skip error state | Alert |

## Verification Checklist

- [ ] Uses Chakra UI components
- [ ] All text via `t()` function
- [ ] Semantic color tokens
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Named export
- [ ] Props typed (no `any`)
- [ ] File under 300 lines
