# Component Creation Reference

## Decision Tree: Component Location

```
Is it used by multiple features?
├── YES → components/[category]/
│   ├── Is it a form component? → components/form/
│   ├── Is it a layout component? → components/layout/
│   ├── Is it a table component? → components/table/
│   └── Is it a UI primitive? → components/ui/
│
└── NO → features/[feature]/components/
    └── Is it large (>200 lines)?
        ├── YES → Create subfolder with index.tsx
        └── NO → Single file
```

## Decision Tree: State Management

```
Where does the data come from?
├── Server → Use React Query hook
├── URL → Use TanStack Router
├── Form → Use React Hook Form
├── Local UI only → Use useState
└── Shared across components → Use Context
```

## Chakra UI v3 Patterns

### Button Variants
```typescript
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary (custom)</Button>
<Button colorPalette="brand">Brand Color</Button>
```

### Form Elements
```typescript
// Use project form components
import { InputRHF } from '@/components/form/input'
import { FormRHF } from '@/components/form/form'

// Chakra native (for non-form contexts)
import { Input, Select, Checkbox } from '@chakra-ui/react'
```

### Cards
```typescript
import { Card } from '@chakra-ui/react'

<Card.Root>
  <Card.Header>
    <Card.Title>{t('title')}</Card.Title>
    <Card.Description>{t('description')}</Card.Description>
  </Card.Header>
  <Card.Body>
    {/* Content */}
  </Card.Body>
  <Card.Footer>
    {/* Actions */}
  </Card.Footer>
</Card.Root>
```

### Tables
```typescript
import { Table } from '@chakra-ui/react'

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>{t('column1')}</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Dialogs
```typescript
import { Dialog } from '@chakra-ui/react'

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>{t('openDialog')}</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{t('dialogTitle')}</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      {/* Content */}
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <Button variant="outline">{t('cancel')}</Button>
      </Dialog.CloseTrigger>
      <Button>{t('confirm')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Common Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| Hardcoded text | Use `t('key')` |
| `interface` for props | Use `type` |
| Default export | Named export |
| Relative imports outside folder | `@/` prefix |
| `any` type | Proper typing |
| Inline styles | Chakra props |
| Custom colors | Semantic tokens |
| Missing loading state | Add Spinner/Skeleton |
| Missing error state | Add Alert |

## Accessibility Checklist

- [ ] Interactive elements are focusable
- [ ] Images have alt text (via `t()`)
- [ ] Form inputs have labels
- [ ] Color is not only indicator
- [ ] Proper heading hierarchy
