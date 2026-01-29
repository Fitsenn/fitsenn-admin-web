# Fitsenn Admin Web

React admin dashboard: TypeScript, Vite, TanStack Router/Query, Chakra UI v3, Supabase.

## Rules

### Always Active
- [Coding Standards](.claude/rules/coding-standards.md) - Types, naming, exports
- [Core Architecture](.claude/rules/core-architecture.md) - Feature structure, data flow

### Reference as Needed
- [UI Standards](.claude/rules/ui-standards.md) - Chakra patterns, states
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
├── lib/                   # Configs (supabase, router, i18n)
├── routes/                # TanStack Router
└── locales/               # en.json, ro.json
```

## Key Patterns

| Pattern | Usage |
|---------|-------|
| Server data | React Query with `queryOptions` |
| Forms | React Hook Form + Zod |
| Routing | TanStack Router (file-based) |
| UI | Chakra UI semantic tokens |
| i18n | All text via `t()` function |

## Critical Rules

1. **NO cross-feature imports** - Compose at route level
2. **NO `any` types** - Use proper typing
3. **NO hardcoded text** - Use translations
4. **Named exports only** - No default exports
5. **Absolute imports** - Use `@/` prefix
