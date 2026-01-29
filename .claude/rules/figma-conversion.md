# Figma to React Conversion

**Rule Tag**: `FIGMA`

## General Rules

- **NO inline styles** - Use Chakra props
- **NO hardcoded colors** - Use semantic tokens
- **NO custom CSS** - Use Chakra system
- **ALL text translated** - Use `t()` function

## Figma to Chakra Mapping

### Layout

| Figma | Chakra |
|-------|--------|
| Auto Layout (vertical) | `<Stack>` |
| Auto Layout (horizontal) | `<Flex>` or `<HStack>` |
| Gap | `gap={n}` |
| Padding | `p={n}` or `px`, `py` |
| Border Radius | `borderRadius="md"` |

### Spacing Scale

| Figma px | Chakra Token |
|----------|--------------|
| 4px | 1 |
| 8px | 2 |
| 12px | 3 |
| 16px | 4 |
| 20px | 5 |
| 24px | 6 |
| 32px | 8 |
| 40px | 10 |
| 48px | 12 |

### Typography

| Figma | Chakra |
|-------|--------|
| Heading 1 | `<Heading size="2xl">` |
| Heading 2 | `<Heading size="xl">` |
| Heading 3 | `<Heading size="lg">` |
| Body | `<Text>` |
| Caption | `<Text fontSize="sm">` |
| Bold | `fontWeight="bold"` |

### Colors

| Figma | Chakra |
|-------|--------|
| Primary text | `color="fg"` |
| Secondary text | `color="fg.muted"` |
| Tertiary text | `color="fg.subtle"` |
| Primary fill | `colorPalette="brand"` |
| Background | `bg="bg"` |
| Subtle bg | `bg="bg.subtle"` |

### Components

| Figma | React/Chakra |
|-------|--------------|
| Primary Button | `<Button colorPalette="brand">` |
| Secondary Button | `<Button variant="outline">` |
| Ghost Button | `<Button variant="ghost">` |
| Text Input | `<InputRHF>` from components/form |
| Card | `<Card.Root>` |
| Modal | `<Dialog.Root>` |
| Dropdown | `<Select>` or `<Menu>` |
| Checkbox | `<Checkbox>` |
| Toggle | `<Switch>` |
| Avatar | `<Avatar>` |
| Badge | `<Badge>` |
| Alert | `<Alert.Root>` |
| Table | `<Table.Root>` or DataTable |

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

## Icon Usage

```typescript
import { Pencil, Trash, Plus } from 'lucide-react'

<Button>
  <Plus />
  {t('common.add')}
</Button>
```

## Examples

### DO
```typescript
<Stack gap={4}>
  <Heading size="xl">{t('title')}</Heading>
  <Text color="fg.muted">{t('description')}</Text>
</Stack>
```

### DON'T
```typescript
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <h1 style={{ fontSize: '24px' }}>Title</h1>
  <p style={{ color: '#666' }}>Description</p>
</div>
```

## Verification Checklist

- [ ] No inline styles
- [ ] No hardcoded colors
- [ ] Uses Chakra spacing tokens
- [ ] Uses Chakra typography
- [ ] All text translated
- [ ] Responsive breakpoints used
- [ ] Dark mode compatible
