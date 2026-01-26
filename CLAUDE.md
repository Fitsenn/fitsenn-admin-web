# Fitsenn Admin Web - Project Instructions

## Project Overview
React admin dashboard built with TypeScript, Vite, TanStack Router/Query, Chakra UI, and Supabase.

## Imported Rules

### Core (Always Active)
@.claude/rules/coding-standards.md
@.claude/rules/core-architecture.md

### Contextual (Reference as Needed)
@.claude/rules/ui-standards.md
@.claude/rules/tanstack-patterns.md
@.claude/rules/figma-conversion.md
@.claude/rules/testing.md

## Project Directory Structure (Mandatory)

```
src/
├── app/                    # Application setup (providers, root)
├── api/                    # Shared API functions
├── components/             # Shared UI components
│   ├── form/              # Form components (FormRHF, InputRHF)
│   ├── layout/            # Layout (Navbar, Sidebar)
│   ├── table/             # Table components
│   └── ui/                # Base UI (Chakra wrappers)
├── config/                # Global configuration
├── contexts/              # React contexts
├── features/              # Feature modules (self-contained)
│   └── [feature]/
│       ├── api/           # Feature API hooks
│       ├── components/    # Feature components
│       ├── hooks/         # Feature hooks
│       ├── types/         # Feature types
│       └── index.ts       # Public exports
├── hooks/                 # Shared hooks
├── lib/                   # Library configs (query-client, router, supabase, i18n)
├── locales/               # Translation files (en.json, ro.json)
├── routes/                # TanStack Router file-based routes
├── types/                 # Global types
└── utils/                 # Utility functions
```

## Technology Stack
- **Framework**: React 19 + TypeScript (strict mode)
- **Build**: Vite
- **Routing**: TanStack Router (file-based)
- **Server State**: TanStack Query
- **UI**: Chakra UI v3
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Backend**: Supabase
- **i18n**: i18next (Romanian default)

## Feature Documentation Requirement
Each feature folder MUST contain a README.md documenting:
- Feature purpose and scope
- API endpoints used
- Component structure
- State management approach
