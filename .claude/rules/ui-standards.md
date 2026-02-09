# UI Standards

**Rule Tag**: `UI`

## 14 Core Principles

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
14. **Dark/Light Mode** - Always implement both themes using semantic tokens

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

#### Modals (Custom Component)

**Always use the custom `Modal` component** from `@/components/ui/modal`:

```typescript
import { Modal } from '@/components/ui/modal'

<Modal open={isOpen} onClose={handleClose} title={t('modal.title')} size="md">
  <Modal.Body>
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
    <Button colorPalette="brand">{t('common.confirm')}</Button>
  </Modal.Footer>
</Modal>
```

Features:
- Slide-in animation from right
- Scrollable content
- Lazy mounting
- Use `id` prop on form + `form` attribute on submit button for forms outside Modal.Footer

## Icons

**Use `lucide-react`** for all icons:

```typescript
import { Plus, Pencil, Trash, Search, ChevronDown } from 'lucide-react'

<Button>
  <Plus />
  {t('common.add')}
</Button>

<IconButton aria-label={t('common.edit')}>
  <Pencil />
</IconButton>
```

## Form Components

**Use React Hook Form components** from `@/components/form`:

```typescript
import { FormRHF, InputRHF, FieldWrapperRHF } from '@/components/form'

const MyForm = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <FormRHF methods={methods} onSubmit={handleSubmit} id="my-form">
      <Stack gap={4}>
        <InputRHF
          name="name"
          control={methods.control}
          label={t('form.name')}
          required
        />
        <InputRHF
          name="email"
          control={methods.control}
          label={t('form.email')}
          type="email"
        />
      </Stack>
    </FormRHF>
  )
}
```

**Form schema in separate file**: `<form-name>.schema.ts`

```typescript
// user-form.schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

export type UserFormData = z.infer<typeof userSchema>
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

## DataTable Component

When implementing tables, use the `DataTable` component. **Reference the types file for all available props:**

**→ [src/components/table/types/index.ts](src/components/table/types/index.ts)**

```typescript
import { DataTable } from '@/components/table/data-table'

<DataTable
  data={users}
  columns={columns}
  isLoading={isLoading}
  error={error}
  enablePagination
  enableSorting
  searchFields={['name', 'email']}
  searchPlaceholder={t('users.search')}
  enableColumnVisibility
  storageKey="users-table"
  toolbarActions={<Button><Plus />{t('users.add')}</Button>}
  rowActions={{
    actions: [
      { type: 'edit', onClick: handleEdit },
      { type: 'delete', onClick: handleDelete },
    ],
  }}
/>
```

Key features:
- **Pagination**: `enablePagination`, `pageSize`, `manualPagination`
- **Sorting**: `enableSorting`, `manualSorting`
- **Search**: `searchFields` array, `manualSearch`
- **Column visibility**: `enableColumnVisibility`, `storageKey` (persists to localStorage)
- **Row actions**: Built-in (`view`, `edit`, `duplicate`, `delete`) + custom actions

## Create/Edit Entity Pattern

**Always use three separate components** for entity CRUD:

```
features/users/components/
├── user-form.schema.ts      # Zod schema
├── user-form.tsx            # Shared form component
├── create-user-modal.tsx    # Create modal (uses UserForm)
└── edit-user-modal.tsx      # Edit modal (uses UserForm)
```

**Routes for modals** (URL = modal state):
```
routes/_authenticated/users.tsx        # List page with <Outlet />
routes/_authenticated/users/add.tsx    # Create modal route
routes/_authenticated/users/$userId.tsx  # Edit modal route (edit/:id pattern)
```

Modal components detect their route via `useMatch()`:

```typescript
// create-user-modal.tsx
const CreateUserModal = () => {
  const match = useMatch({ from: '/_authenticated/users/add', shouldThrow: false })
  const isOpen = !!match

  return <UserForm isOpen={isOpen} onSubmit={handleCreate} />
}

// edit-user-modal.tsx
const EditUserModal = () => {
  const match = useMatch({ from: '/_authenticated/users/$userId', shouldThrow: false })
  const userId = match?.params?.userId
  const isOpen = !!userId

  return <UserForm isOpen={isOpen} onSubmit={handleUpdate} initialValues={...} />
}
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Hardcode text | Use `t()` |
| Inline colors | Semantic tokens |
| Custom CSS | Chakra props |
| Default exports | Named exports |
| Skip loading state | Spinner/Skeleton |
| Skip error state | Alert |
| Use Chakra Dialog directly | Use `Modal` component |
| Import random icon libraries | Use `lucide-react` |
| Light-mode-only colors | Semantic tokens for both themes |
| Single component for create/edit | Separate CreateModal, EditModal, Form |
| State-based modal open/close | Route-based modals |

## Verification Checklist

- [ ] Uses Chakra UI components
- [ ] All text via `t()` function
- [ ] Semantic color tokens (works in dark/light mode)
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Named export
- [ ] Props typed (no `any`)
- [ ] File under 300 lines
- [ ] Icons from `lucide-react`
- [ ] Forms use `FormRHF` + `InputRHF`
- [ ] Modals use `Modal` component
- [ ] Tables reference `DataTable` types
- [ ] Responsive breakpoints for mobile
