# Coding Standards

**Rule Tag**: `CODING`

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `UserProfile`, `LoginForm` |
| Files/Folders | kebab-case | `user-profile.tsx`, `login-form/` |
| Hooks | camelCase with `use` prefix | `useAuth`, `useLocalStorage` |
| Types | PascalCase | `UserProfile`, `ApiResponse` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `DEFAULT_LANGUAGE` |
| Variables/Functions | camelCase | `isLoading`, `handleSubmit` |
| Boolean Variables | `is`/`has`/`should` prefix | `isOpen`, `hasError`, `shouldRefetch` |

## Type Safety Rules

- **ALWAYS** type props and return types explicitly
- **NEVER** use `any` - use `unknown` if type is truly unknown
- **ALWAYS** use `type` instead of `interface`
- **AVOID** type assertions unless absolutely necessary
- **ALWAYS** define types close to their usage

```typescript
// ✅ Correct
type UserCardProps = {
  user: User
  onEdit?: (user: User) => void
}

// ❌ Wrong - using any
const handleData = (data: any) => { ... }

// ❌ Wrong - using interface
interface UserCardProps { ... }
```

## Component Structure

Every component MUST follow this order:

```typescript
// 1. Imports
import { useState } from 'react'
import { Box } from '@chakra-ui/react'

// 2. Types
type ComponentProps = {
  // props
}

// 3. Component
const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 4. Hooks (consistent order)
  const [state, setState] = useState()

  // 5. Queries/Mutations
  const { data } = useQuery()

  // 6. Effects
  useEffect(() => {}, [])

  // 7. Event handlers
  const handleClick = () => {}

  // 8. Render helpers (if needed)
  const renderItem = () => {}

  // 9. Early returns
  if (!data) return null

  // 10. Main render
  return <Box>...</Box>
}

// 11. Named export
export { Component }
```

## Code Quality Rules

- **ALWAYS** use absolute imports with `@/` prefix
- **PREFER** destructuring props in function signature
- **PREFER** default parameters over conditional defaults
- **MAX** 200-300 lines per file - split if larger
- **EXTRACT** functions over 25 lines into separate helpers

## Export Rules

- **Components**: Use grouped named exports at the end of the file
- **Functions, types, constants**: Export inline where defined
- **Types**: Always use `export type` for type exports

```typescript
// ✅ Correct - Component with grouped export
const UserCard = ({ user }: UserCardProps) => { ... }
const UserList = ({ users }: UserListProps) => { ... }

export { UserCard, UserList }

// ✅ Correct - Inline exports for functions and types
export type User = { id: string; name: string }

export const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`
}

export const USER_ROLES = ['admin', 'user', 'guest'] as const

// ❌ Wrong - Grouped export for non-components
type User = { ... }
const formatUserName = () => { ... }
export { User, formatUserName }  // Should be inline

// ❌ Wrong - Missing 'type' keyword
export { User }  // Should be: export type { User }
```

## Function Extraction Rules

- **EXTRACT** pure functions (no dependencies on component state/props) outside the component
- **KEEP** event handlers and functions using hooks/state inside the component
- **CREATE** a `<component-name>.utils.ts` file when you have 3+ utility functions

```typescript
// ✅ Correct - Pure function extracted outside
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

const ShoppingCart = ({ items }: ShoppingCartProps) => {
  // Event handler stays inside (uses component context)
  const handleCheckout = () => {
    const total = calculateTotal(items)
    // ... checkout logic
  }

  return <Box>{formatPrice(calculateTotal(items))}</Box>
}

// ❌ Wrong - Pure function inside component
const ShoppingCart = ({ items }: ShoppingCartProps) => {
  const calculateTotal = (items: Item[]): number => {  // Should be outside
    return items.reduce((sum, item) => sum + item.price, 0)
  }
}
```

When utilities grow, create a separate file:

```
components/
└── shopping-cart/
    ├── shopping-cart.tsx
    └── shopping-cart.utils.ts  # calculateTotal, formatPrice, etc.
```

## useEffect Rules

- **NEVER** have multiple useEffects with the same dependency array - combine them
- **ALWAYS** add a descriptive comment above useEffect explaining its purpose
- **PREFER** combining related logic into a single effect

```typescript
// ❌ Wrong - duplicate dependency arrays
useEffect(() => {
  if (items.length > 0 && !selectedId) {
    setSelectedId(items[0].id);
  }
}, [items, selectedId]);

useEffect(() => {
  if (items.length > 0 && selectedId && !items.some((i) => i.id === selectedId)) {
    setSelectedId(items[0].id);
  }
}, [items, selectedId]);

// ✅ Correct - combined into single effect
// Auto-select first item if none selected or selected no longer exists
useEffect(() => {
  if (
    items.length > 0 &&
    (!selectedId || !items.some((i) => i.id === selectedId))
  ) {
    setSelectedId(items[0].id);
  }
}, [items, selectedId]);
```

## localStorage Rules

- **ALWAYS** use `useLocalStorage` hook from `@/hooks/use-local-storage`
- **NEVER** manually manage both useState and localStorage together

```typescript
// ❌ Wrong - manual state + localStorage
const [value, setValue] = useState(() => localStorage.getItem('key'));
const setValueWithStorage = (newValue: string) => {
  setValue(newValue);
  localStorage.setItem('key', newValue);
};

// ✅ Correct - use the hook
const [value, setValue] = useLocalStorage('key', '');
```

## Import Order

1. React imports
2. External library imports
3. Internal absolute imports (`@/...`)
4. Relative imports (`./...`)
5. Type imports (can be grouped with their source)

```typescript
import { useState, useEffect } from 'react'

import { Box, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/button'

import { UserCard } from './user-card'
```

## Localization Rules

- **ALWAYS** use `useTranslation` hook for text
- **NEVER** hardcode user-facing strings
- **ORGANIZE** translations by feature in locale files
- **USE** interpolation for dynamic values: `t('key', { value })`

```typescript
// ✅ Correct
const { t } = useTranslation()
return <Text>{t('users.title')}</Text>

// ❌ Wrong - hardcoded string
return <Text>Users</Text>
```

## Package Manager

**Use `yarn`** for all package management. Never use `npm` or `pnpm`.

```bash
# ✅ Correct
yarn install
yarn add package-name
yarn dev

# ❌ Wrong
npm install
pnpm add package-name
```

## Verification Checklist

Before completing any task, verify:

- [ ] No `any` types used
- [ ] All user-facing text uses `t()` function
- [ ] Components use grouped `export { }`, functions/types use inline exports
- [ ] Absolute imports with `@/` prefix
- [ ] Component follows standard structure
- [ ] Files under 300 lines
- [ ] Boolean variables have proper prefix
- [ ] Pure functions extracted outside component
