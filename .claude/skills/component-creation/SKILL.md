---
name: creating-components
description: Creates React components with Chakra UI, TypeScript, and i18n. Use when creating new components, pages, or refactoring existing UI. Triggers on requests for UI elements, pages, cards, modals, or any visual component.
---

# Creating Components

## Quick Start

```typescript
import { useTranslation } from 'react-i18next'
import { Box, Heading, Text } from '@chakra-ui/react'

type ComponentProps = {
  title: string
}

const Component = ({ title }: ComponentProps) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading>{t('feature.title')}</Heading>
      <Text color="fg.muted">{t('feature.description')}</Text>
    </Box>
  )
}

export { Component }
```

## Critical Rules

1. **NO hardcoded text** - All strings via `t()` function
2. **NO `any` types** - Properly type all props
3. **Named exports only** - No default exports
4. **Absolute imports** - Use `@/` prefix outside component folder
5. **Chakra UI only** - No custom CSS or inline styles
6. **Semantic tokens** - Use `fg.muted`, `bg.subtle` for dark/light mode

## File Locations

| Type | Location |
|------|----------|
| Feature-specific | `features/[feature]/components/` |
| Shared/Reusable | `components/[category]/` |

## Templates

- **Page component**: See [templates/page.tsx](templates/page.tsx)
- **Generic component**: See [templates/component.tsx](templates/component.tsx)

## Reference

- **Decision trees & patterns**: See [reference.md](reference.md)

## Checklist

- [ ] All text uses `t()` function
- [ ] Translations added to `locales/en.json` and `locales/ro.json`
- [ ] Uses Chakra UI components
- [ ] Props properly typed (no `any`)
- [ ] Named export
- [ ] File under 300 lines
- [ ] Loading state handled
- [ ] Error state handled
