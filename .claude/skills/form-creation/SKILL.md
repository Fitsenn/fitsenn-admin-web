# Form Creation Skill

**Rule Tag**: `FORM`

## Critical Rules

1. **ALWAYS use Zod** for validation schemas
2. **ALWAYS separate schemas** into `.schema.ts` files
3. **ALWAYS use `FormRHF`** wrapper component
4. **ALWAYS use form components** from `@/components/form`
5. **ALWAYS localize error messages**
6. **ALWAYS handle loading states** on submit button

## File Structure

```
features/[feature]/components/
├── [form-name].schema.ts    # Zod schema
└── [form-name].tsx          # Form component
```

## Templates

See `templates/` folder for:
- `schema.ts` - Zod schema template
- `form.tsx` - Form component template

## Schema Pattern

```typescript
// login-form.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid'),
  password: z
    .string()
    .min(1, 'auth.validation.passwordRequired')
    .min(8, 'auth.validation.passwordTooShort'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

## Form Component Pattern

```typescript
// login-form.tsx
import { Button, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormRHF } from '@/components/form/form'
import { InputRHF } from '@/components/form/input'

import { loginSchema, type LoginFormData } from './login-form.schema'

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void>
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { formState: { isSubmitting } } = methods

  const handleSubmit = async (data: LoginFormData) => {
    await onSubmit(data)
  }

  return (
    <FormRHF methods={methods} onSubmit={handleSubmit}>
      <Stack gap={4}>
        <InputRHF
          name="email"
          label={t('auth.emailAddress')}
          type="email"
          placeholder={t('auth.emailPlaceholder')}
        />

        <InputRHF
          name="password"
          label={t('auth.password')}
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
        />

        <Button
          type="submit"
          colorPalette="brand"
          loading={isSubmitting}
          loadingText={t('common.submitting')}
        >
          {t('auth.logIn')}
        </Button>
      </Stack>
    </FormRHF>
  )
}

export { LoginForm }
```

## Localized Error Messages

Error messages in schema should be translation keys:

```typescript
// Schema
email: z.string().email('auth.validation.emailInvalid')

// In locale file (en.json)
{
  "auth": {
    "validation": {
      "emailInvalid": "Please enter a valid email address"
    }
  }
}

// Error display (handled by InputRHF)
// The component should translate the error message
```

## Form with Mutation

```typescript
const ProfileForm = () => {
  const { t } = useTranslation()
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      toaster.success({ title: t('profile.updateSuccess') })
    } catch (error) {
      toaster.error({ title: t('profile.updateError') })
    }
  }

  return (
    <FormRHF methods={methods} onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button loading={isPending}>
        {t('common.save')}
      </Button>
    </FormRHF>
  )
}
```

## Available Form Components

From `@/components/form`:
- `FormRHF` - Form wrapper with FormProvider
- `InputRHF` - Text input with validation
- `FieldWrapper` - Field container with label/error

## Validation Patterns

### Required Field
```typescript
z.string().min(1, 'validation.required')
```

### Email
```typescript
z.string().email('validation.emailInvalid')
```

### Password
```typescript
z.string().min(8, 'validation.passwordTooShort')
```

### Confirm Password
```typescript
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
})
```

### Optional Field
```typescript
z.string().optional()
// or
z.string().nullish()
```

## Checklist

- [ ] Schema in separate `.schema.ts` file
- [ ] Type inferred from schema with `z.infer<typeof schema>`
- [ ] Uses `FormRHF` wrapper
- [ ] Uses form components from `@/components/form`
- [ ] Error messages are translation keys
- [ ] Submit button shows loading state
- [ ] `defaultValues` provided to `useForm`
- [ ] Connected to mutation hook
- [ ] Success/error feedback shown
