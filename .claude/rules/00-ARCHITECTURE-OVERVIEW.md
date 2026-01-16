When I say 'check protocol', add to the start of the response 'Rules are active in 00 file'.

# Bulletproof React Architecture Rules

## Overview

This document defines universal Bulletproof Architecture principles for React applications. It emphasizes maintainability, and scalability through colocation and feature-based development.

## 🎯 Core Principles

This architecture is built on the following foundational principles:

### 1. **Accessibility & Clarity**

- Easy onboarding for new developers
- Simple, understandable code structure
- Self-documenting code organization

### 2. **Proper Tool Selection**

- Right technologies for specific problems
- Prefer specialized solutions over monolithic ones
- Use TypeScript for type safety

### 3. **Clear Boundaries**

- Clean separation between application layers
- Unidirectional data flow
- No cross-feature imports

### 4. **Team Alignment**

- Consistent development practices
- Enforced coding standards
- Shared component library

### 5. **Production Standards**

- Security best practices
- Performance optimization
- Error handling and monitoring

### 6. **Scalability**

- Supports growing codebases
- Feature-based organization
- Modular architecture

### 7. **Early Issue Detection**

- TypeScript type checking
- ESLint and Prettier
- Pre-commit hooks with Husky

---

## 📁 High-Level Architecture

```
src/
├── app/                   # Application layer (providers, main app)
├── assets/                # Static files (images, fonts)
├── components/            # Shared components
├── config/                # Global configurations
├── features/              # Feature modules (main organizational unit)
├── hooks/                 # Shared custom hooks
├── lib/                   # Preconfigured libraries
├── routes/                # File-based routes
├── testing/               # Test utilities and mocks
├── types/                 # Shared TypeScript types
└── utils/                 # Shared utility functions
```

---

## 🔄 Data Flow Direction

```
┌─────────────┐
│   Shared    │  ← Can be imported by features and app
│ (components,│
│  hooks, etc)│
└─────────────┘
      ↑
      │
┌─────────────┐
│  Features   │  ← Can import from shared, can be imported by app
│ (auth, users│     CANNOT import from other features
│  dashboard) │
└─────────────┘
      ↑
      │
┌─────────────┐
│     App     │  ← Top level, imports from features and shared
│  (routing,  │
│  providers) │
└─────────────┘
```

**Critical Rule**: Code flows in ONE DIRECTION only:

- `shared` → `features` → `app`
- Features NEVER import from other features
- Compose features at the app level

---

## 🏗️ Feature-Based Architecture

Each feature is a self-contained module:

```
features/
└── authentication/
    ├── api/             # API calls specific to this feature
    ├── components/      # Feature-specific components
    ├── hooks/           # Feature-specific hooks
    ├── stores/          # Feature state management
    ├── types/           # Feature TypeScript types
    ├── utils/           # Feature utility functions
    └── index.ts         # Public API of the feature
```

**Benefits**:

- Easy to locate all code related to a feature
- Clear boundaries between features
- Can be extracted into separate packages
- Easier to test in isolation

---

## 🧩 State Management Strategy

State is divided into **5 categories**:

### 1. **Component State**

- Local to individual components
- Tools: `useState`, `useReducer`
- **Rule**: Start here, elevate only when needed

### 2. **Application State**

- Global UI state (modals, notifications, theme)
- Tools: Context + Hooks
- **Rule**: Localize as close as possible to components that need it

### 3. **Server Cache State**

- Client-side cache of server data
- Tools: React Query
- **Rule**: NEVER store in application state

### 4. **Form State**

- Form data and validation
- Tools: React Hook Form + Zod
- **Rule**: Use specialized form libraries and also use implemented components
  from /components/form that use RHF under the hood

### 5. **URL State**

- Path parameters and query strings
- Tools: Tanstack router
- **Rule**: Leverage URL for shareable state

---

## 🔒 Type Safety

- **TypeScript everywhere** - No JavaScript files
- **Strict mode enabled** - Catch errors early
- **API types** - Generated or manually defined
- **Zod schemas** - Runtime validation + type inference

---

## 🎨 Component Philosophy

### Colocation

"Place components as close as possible to where they are being used"

### Composition Over Props

When props become excessive:

- Split the component
- Use composition (children, slots)
- Consider using a headless component

---

## 🚀 Performance Considerations

- **Code splitting** - Lazy load routes and heavy components
- **Memoization** - Use React.memo, useMemo, useCallback wisely
- **Server cache** - Leverage React Query's caching

---

## 🎓 Key Takeaways

1. **Feature-based structure** keeps related code together
2. **Unidirectional flow** prevents circular dependencies
3. **State categorization** uses the right tool for each type
4. **Type safety** catches errors before runtime
5. **Colocation** improves maintainability
6. **Composition** beats complex props drilling
7. **Standards enforcement** through tooling, not documentation

---
