# Testing Standards

**Rule Tag**: `TESTING`

## Tech Stack

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Mocking**: vi.fn(), vi.mock()

## Test File Location (Colocated)

```
features/[feature]/
├── components/
│   ├── user-card.tsx
│   └── user-card.test.tsx
└── api/
    ├── get-user.ts
    └── get-user.test.ts
```

## Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { UserCard } from './user-card'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  }

  it('renders user information', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()

    render(<UserCard user={mockUser} onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith(mockUser)
  })
})
```

## Query Priority (Accessibility)

1. `getByRole` - Most accessible
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

```typescript
// Preferred
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')

// Avoid
screen.getByTestId('submit-button')
```

## Testing with Providers

```typescript
// testing/test-utils.tsx
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/lib/i18n'
import { system } from '@/lib/theme'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: object) =>
  render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

## Testing Forms

```typescript
describe('LoginForm', () => {
  it('submits with valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
})
```

## Mocking Supabase

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    }),
  },
}))
```

## What to Test / Not Test

### DO Test
- Component renders correctly
- User interactions
- Loading/error states
- Form validation
- Conditional rendering

### DON'T Test
- Implementation details
- Internal state
- Framework functionality
- Styling (unless critical)

## Verification Checklist

- [ ] Tests colocated with source
- [ ] Uses accessible queries
- [ ] Tests behavior, not implementation
- [ ] Loading states tested
- [ ] Error states tested
- [ ] Form validation tested
- [ ] Uses vi.fn() for callbacks
