# Fitsenn Admin Web

React admin dashboard: TypeScript, Vite, TanStack Router/Query, Chakra UI v3, Supabase.

**Package Manager**: `yarn` (not npm or pnpm)

## Rules

### Always Active
- [Coding Standards](.claude/rules/coding-standards.md) - Types, naming, exports
- [Core Architecture](.claude/rules/core-architecture.md) - Feature structure, data flow

### Reference as Needed
- [UI Standards](.claude/rules/ui-standards.md) - Chakra patterns, forms, modals, tables
- [TanStack Patterns](.claude/rules/tanstack-patterns.md) - Router, Query
- [Figma Conversion](.claude/rules/figma-conversion.md) - Design to code
- [Testing](.claude/rules/testing.md) - Vitest, RTL

## Structure

```
src/
├── features/[feature]/     # Self-contained modules
│   ├── api/               # Query/mutation hooks
│   ├── components/        # Feature UI
│   ├── hooks/             # Feature hooks
│   └── types/             # Feature types
├── components/            # Shared UI
│   ├── form/              # FormRHF, InputRHF, FieldWrapperRHF
│   ├── table/             # DataTable (see types/index.ts for props)
│   └── ui/                # Modal, etc.
├── hooks/                 # Shared hooks (useDateHelpers, useLocalStorage)
├── utils/                 # data-transformers, string utils
├── types/                 # database.types.ts, utility-types.ts
├── lib/                   # Configs (supabase, router, i18n)
├── routes/                # TanStack Router
└── locales/               # en.json, ro.json
```

## Quick Reference

| What | Where/How |
|------|-----------|
| Icons | `lucide-react` |
| Forms | `FormRHF` + form input components from `@/components/form` |
| Form schemas | `<form-name>.schema.ts` (separate file) |
| Modals | `Modal` from `@/components/ui/modal` |
| Tables | `DataTable` - see [types](src/components/table/types/index.ts) |
| Date formatting | `useDateHelpers` hook (timezone-aware) |
| DB → App types | `transformers.fromDatabase()` / `transformers.toDatabase()` |
| Type conversion | `DatabaseEntity = Tables<'entity'>`, `Entity = SnakeToCamel<DatabaseEntity>` |

## Key Patterns

| Pattern | Usage |
|---------|-------|
| Server data | React Query hooks |
| Forms | React Hook Form + Zod |
| Routing | TanStack Router (file-based) |
| UI | Chakra UI semantic tokens |
| i18n | All text via `t()` function |
| Cache updates | Prefer `setQueryData` over `invalidateQueries` |

## Entity CRUD Pattern

For create/edit flows, always use:
- `entity-form.schema.ts` - Zod schema
- `entity-form.tsx` - Shared form component
- `create-entity-modal.tsx` - Create modal
- `edit-entity-modal.tsx` - Edit modal

Routes (URL = modal state):
- `/entity` - List page
- `/entity/add` - Create modal
- `/entity/$entityId` - Edit modal

## Critical Rules

1. **Use `yarn`** - Never npm or pnpm
2. **NO cross-feature imports** - Compose at route level
3. **NO `any` types** - Use proper typing
4. **NO hardcoded text** - Use translations
5. **Export rules** - Components: `export { }`, Functions/types: inline export
6. **Absolute imports** - Use `@/` prefix
7. **Dark/light mode** - Always use semantic tokens
8. **Extract pure functions** - Outside component, or to `.utils.ts` file
9. **Transform DB data** - Always use `transformers.fromDatabase/toDatabase`
