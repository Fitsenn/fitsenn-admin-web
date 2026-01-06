# Data Table Component API Design

## Overview
A reusable table component using @tanstack/react-table for state management and Chakra UI for styling.

### Visual Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ Table Toolbar                                                   │
│ ┌──────────────────────────┐  ┌─────────┐  ┌─────────────────┐│
│ │ 🔍 Search users...       │  │ Columns │  │ Custom Actions  ││
│ └──────────────────────────┘  └─────────┘  └─────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Table Header                                                    │
│ ┌────┬──────────┬─────────────────┬──────────┬────────┬────────┐│
│ │ ☐  │ Name ↑   │ Email           │ Status   │ Role   │ Actions││
│ ├────┼──────────┼─────────────────┼──────────┼────────┼────────┤│
│ │ ☐  │ John Doe │ john@email.com  │ [Active] │ Admin  │ •••    ││
│ │ ☐  │ Jane Doe │ jane@email.com  │ [Active] │ User   │ •••    ││
│ │ ☐  │ Bob Smith│ bob@email.com   │ [Pending]│ User   │ •••    ││
│ └────┴──────────┴─────────────────┴──────────┴────────┴────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Pagination                                                      │
│ Showing 1-10 of 100          [< Previous] [1] [2] [3] [Next >] │
│ Rows per page: [10 ▾]                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Features Overview
- ✅ **Pagination**: Navigate through large datasets (client-side & server-side)
- ✅ **Sorting**: Click column headers to sort (↑↓) (client-side & server-side)
- ✅ **Search**: Global search across multiple fields with 300ms debounce (client-side & server-side)
- ✅ **Custom Renderers**: Colored badges, action buttons, etc. via TanStack Table's `cell` property
- ✅ **Loading/Error/Empty States**: Graceful handling of all states (always shows table header)
- ✅ **Type-Safe**: Full TypeScript support with TanStack Table official types
- 🔄 **Column Visibility**: Show/hide columns via dropdown + localStorage (Phase 6 - in progress)
- 📋 **Column Filters**: Per-column filtering (planned)
- 📋 **Row Selection**: Checkbox selection (planned)
- 📋 **Toolbar Actions**: Custom action buttons in toolbar (planned)

## Usage Examples

### Example 1: Basic Table (No Features)

```typescript
import { DataTable } from '@/components/table'
import type { ColumnDef } from '@tanstack/react-table'

type User = {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => (
      <StatusBadge status={info.getValue() as User['status']} />
    ),
  },
]

function BasicUsersTable() {
  const { data, isLoading, error } = useUsers()

  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

### Example 2: Client-Side Table (All Features)

```typescript
function FullFeaturedUsersTable() {
  const { data, isLoading, error } = useUsers()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding: false, // Cannot be hidden
      enableSorting: false, // Cannot be sorted
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue() as User['status']} />,
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      enableSorting: true,
    },
  ]

  return (
    <DataTable
      // Data
      data={data ?? []}
      columns={columns}

      // Pagination
      enablePagination
      pageSize={20}
      pageSizeOptions={[10, 20, 50, 100]}

      // Sorting
      enableSorting

      // Search & Filtering
      enableSearch
      searchFields={['name', 'email', 'role']}
      searchPlaceholder="Search users..."

      // Column Visibility
      storageKey="users-table"
      enableColumnVisibility

      // States
      isLoading={isLoading}
      error={error}
    />
  )
}
```

### Example 3: Server-Side Table (Manual Pagination & Sorting)

```typescript
function ServerSideUsersTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Server-side query with parameters
  const { data, isLoading, error } = useUsers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: searchQuery,
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue() as User['status']} />,
    },
  ]

  return (
    <DataTable
      // Data
      data={data?.users ?? []}
      columns={columns}

      // Server-side pagination
      enablePagination
      manualPagination
      pageCount={data?.totalPages}
      onPaginationChange={setPagination}

      // Server-side sorting
      enableSorting
      manualSorting
      onSortingChange={setSorting}

      // Server-side search
      enableSearch
      manualSearch
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search users..."

      // States
      isLoading={isLoading}
      error={error}
    />
  )
}
```

### Example 4: Table with Custom Toolbar Actions

```typescript
function UsersTableWithActions() {
  const { data, isLoading, error } = useUsers()
  const [selectedRows, setSelectedRows] = useState<User[]>([])

  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      enablePagination
      enableSorting
      enableSearch
      searchFields={['name', 'email']}
      storageKey="users-table"
      isLoading={isLoading}
      error={error}
      toolbarActions={
        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<PlusIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
        </HStack>
      }
    />
  )
}
```

---

## Props API

```typescript
type DataTableProps<T> = {
  // ==================== Data ====================
  /** The data to display in the table */
  data: T[]

  /** Column definitions using TanStack Table's ColumnDef */
  columns: ColumnDef<T>[]

  // ==================== Pagination ====================
  /** Enable pagination (default: false) */
  enablePagination?: boolean

  /** Default page size (default: 10) */
  pageSize?: number

  /** Available page size options (default: [10, 20, 50, 100]) */
  pageSizeOptions?: number[]

  /** Server-side pagination - table won't paginate data automatically */
  manualPagination?: boolean

  /** Total number of pages (required for server-side pagination) */
  pageCount?: number

  /** Callback when pagination state changes (for server-side) */
  onPaginationChange?: (pagination: PaginationState) => void

  // ==================== Sorting ====================
  /** Enable sorting (default: false) */
  enableSorting?: boolean

  /** Server-side sorting - table won't sort data automatically */
  manualSorting?: boolean

  /** Callback when sorting state changes (for server-side) */
  onSortingChange?: (sorting: SortingState) => void

  // ==================== Search & Filtering ====================
  /** Enable global search input (searches across multiple fields) */
  enableSearch?: boolean

  /** Fields to search when using the search input */
  searchFields?: (keyof T)[]

  /** Placeholder text for search input (default: "Search...") */
  searchPlaceholder?: string

  /** Server-side search - table won't filter data automatically */
  manualSearch?: boolean

  /** Callback when search query changes (for server-side search) */
  onSearchChange?: (searchQuery: string) => void

  /** Enable column-specific filters (default: false) */
  enableColumnFilters?: boolean

  /** Server-side column filtering - table won't filter columns automatically */
  manualFiltering?: boolean

  /** Callback when column filters change (for server-side) */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void

  // ==================== Column Visibility ====================
  /** Unique key for persisting table state in localStorage */
  storageKey?: string

  /** Enable column visibility toggle (default: true) */
  enableColumnVisibility?: boolean

  // ==================== States ====================
  /** Loading state */
  isLoading?: boolean

  /** Error state */
  error?: Error | null

  // ==================== Customization ====================
  /** Custom empty state component */
  emptyState?: React.ReactNode

  /** Custom error state component */
  errorState?: (error: Error) => React.ReactNode

  /** Custom toolbar actions (rendered in top-right) */
  toolbarActions?: React.ReactNode
}
```

---

## Feature Details

### Pagination

**Client-side (default)**:
- Table automatically paginates data
- All data must be loaded in memory

**Server-side** (set `manualPagination={true}`):
- Table displays current page only
- You handle fetching data for each page
- Must provide `pageCount` and `onPaginationChange`

```typescript
// Server-side pagination
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

<DataTable
  enablePagination
  manualPagination
  pageCount={totalPages}
  onPaginationChange={setPagination}
/>
```

### Sorting

**Client-side (default)**:
- Table automatically sorts data
- Works with any data type
- Can provide custom `sortingFn` in column definition

**Server-side** (set `manualSorting={true}`):
- Table displays data as-is
- You handle sorting on the server
- Use `onSortingChange` to get sort state

**Column Configuration**:
```typescript
{
  accessorKey: 'name',
  header: 'Name',
  enableSorting: true, // Enable sorting for this column
  sortingFn: 'alphanumeric', // Custom sorting function
}
```

### Search

Searches across multiple fields simultaneously using a global search input.

**How it works**:
1. User types in search input
2. Table filters rows where ANY of the `searchFields` match
3. Case-insensitive by default
4. Debounced for performance (optional)

**Client-side search** (default):
```typescript
<DataTable
  enableSearch
  searchFields={['name', 'email', 'role']}
  searchPlaceholder="Search users..."
/>
```

**Server-side search** (set `manualSearch={true}`):
```typescript
const [searchQuery, setSearchQuery] = useState('')

<DataTable
  enableSearch
  manualSearch
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search users..."
/>
```

**Note**: Internally, this uses TanStack Table's global filter feature, but the API uses more intuitive naming for better developer experience.

### Column Filters

Individual filters per column (optional advanced feature).

```typescript
// Column definition with custom filter
{
  accessorKey: 'status',
  header: 'Status',
  enableColumnFilter: true,
  filterFn: 'equals', // Built-in filter function
  meta: {
    filterComponent: (column) => (
      <Select onChange={(e) => column.setFilterValue(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    ),
  },
}
```

### Column Visibility

**How it works**:
1. **Built-in TanStack Table feature**: Uses `columnVisibility` state
2. **Dropdown UI**: Menu button with checkboxes for each hideable column
3. **LocalStorage persistence**: Automatically saves/restores column visibility
4. **Per-column control**: Use `enableHiding: false` to prevent hiding important columns

**Column Definition**:
```typescript
{
  accessorKey: 'id',
  header: 'ID',
  enableHiding: false, // Cannot be hidden
}
```

**Persistence**:
- Provide `storageKey` prop to enable localStorage persistence
- Column visibility state is saved automatically
- Restored on component mount

---

## Custom Cell Renderers

TanStack Table provides excellent support for custom renderers through the `cell` property.

### Approach 1: Inline Cell Renderer (Recommended for simple cases)
```typescript
{
  accessorKey: 'status',
  header: 'Status',
  cell: (info) => {
    const status = info.getValue() as string
    return <StatusBadge status={status} />
  },
}
```

### Approach 2: Extracted Cell Component (Recommended for complex logic)
```typescript
// In features/users/components/user-status-cell.tsx
type UserStatusCellProps = {
  status: User['status']
}

export const UserStatusCell = ({ status }: UserStatusCellProps) => {
  const colorScheme = {
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
  }[status]

  return (
    <Badge colorScheme={colorScheme} textTransform="capitalize">
      {status}
    </Badge>
  )
}

// In column definition:
{
  accessorKey: 'status',
  header: 'Status',
  cell: (info) => <UserStatusCell status={info.getValue() as User['status']} />,
}
```

### Approach 3: Helper Factory Functions (For reusable patterns)
```typescript
// In src/components/table/cell-helpers.tsx
import type { CellContext } from '@tanstack/react-table'
import { Badge } from '@chakra-ui/react'

type StatusConfig<T extends string> = Record<T, { colorScheme: string; label?: string }>

export const createStatusCell = <TData, TStatus extends string>(
  config: StatusConfig<TStatus>
) => {
  return (info: CellContext<TData, unknown>) => {
    const status = info.getValue() as TStatus
    const { colorScheme, label } = config[status]

    return (
      <Badge colorScheme={colorScheme} textTransform="capitalize">
        {label ?? status}
      </Badge>
    )
  }
}

// Usage:
{
  accessorKey: 'status',
  header: 'Status',
  cell: createStatusCell<User, User['status']>({
    active: { colorScheme: 'green' },
    inactive: { colorScheme: 'gray' },
    pending: { colorScheme: 'yellow', label: 'Pending Review' },
  }),
}
```

---

## Recommended Approach for Custom Renderers

**Use the inline `cell` property for most cases:**
- ✅ Flexible and type-safe
- ✅ Built into TanStack Table
- ✅ Easy to understand
- ✅ Supports any React component

**Create helper functions only for:**
- Repeated patterns across multiple tables
- Complex logic that needs testing
- When you want to enforce consistency

**Extract to separate components when:**
- Cell logic is complex (>10 lines)
- Cell has its own state or side effects
- Cell needs to be unit tested

---

## Example: Full Column Definition with Multiple Renderers

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false, // Always visible
  },
  {
    accessorKey: 'name',
    header: 'Name',
    // Default text rendering
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => (
      <Text color="blue.600" textDecoration="underline">
        {info.getValue() as string}
      </Text>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <UserStatusCell status={info.getValue() as User['status']} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: (info) => {
      const date = info.getValue() as string
      return <Text fontSize="sm">{format(new Date(date), 'PP')}</Text>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (info) => <UserTableActions user={info.row.original} />,
    enableHiding: false,
  },
]
```

---

## Architecture Notes

### Component Structure:
```
src/components/table/
├── data-table.tsx                  # Main table component
├── components/
│   ├── table-toolbar.tsx           # Search, column visibility, actions
│   ├── column-visibility-menu.tsx  # Dropdown for toggling columns
│   ├── table-pagination.tsx        # Pagination controls
│   ├── table-skeleton.tsx          # Loading state
│   ├── table-error.tsx             # Error state
│   └── table-empty.tsx             # Empty state
├── hooks/
│   ├── use-table-storage.ts        # Hook for localStorage persistence
│   └── use-table-search.ts         # Hook for search functionality
├── utils/
│   └── cell-helpers.tsx            # Optional: Reusable cell factories
├── types.ts                        # Table-specific types
└── index.ts                        # Public exports
```

### Key Features:
1. **Pagination**: Client-side or server-side with customizable page sizes
2. **Sorting**: Column sorting with visual indicators
3. **Global Filter**: Search across multiple fields
4. **Column Filters**: Optional per-column filtering
5. **Column Visibility**: Menu button with checkboxes + localStorage
6. **Custom Renderers**: Use TanStack Table's `cell` property
7. **Loading State**: Skeleton loader
8. **Error State**: Error message with retry
9. **Empty State**: Message when no data
10. **Type Safety**: Full TypeScript support with generics

### Design Decisions:

1. **Flexibility First**: Support both client-side and server-side operations
2. **Progressive Enhancement**: Start simple, enable features as needed
3. **Type Safety**: Leverage TypeScript generics for full type inference
4. **Separation of Concerns**: Toolbar, table body, and pagination are separate components
5. **Composability**: Custom toolbar actions via render props
6. **Persistence**: Optional localStorage for column visibility
7. **Accessibility**: Proper ARIA labels and keyboard navigation

---

## Implementation Plan

### Phase 1: Core Table
1. ✅ Finalize API design
2. Set up types and interfaces
3. Implement `data-table.tsx` with basic rendering
4. Implement loading, error, and empty states

### Phase 2: Pagination
5. Implement `table-pagination.tsx` component
6. Add client-side pagination support
7. Add server-side pagination support

### Phase 3: Sorting
8. Add sorting indicators to column headers
9. Implement client-side sorting
10. Implement server-side sorting callbacks

### Phase 4: Search & Filtering
11. Implement `table-toolbar.tsx` with search input
12. Implement `use-table-search.ts` hook
13. Add client-side search (using TanStack Table's global filter)
14. Add server-side search callbacks

### Phase 5: Column Visibility
15. Implement `column-visibility-menu.tsx`
16. Implement `use-table-storage.ts` hook
17. Add localStorage persistence

### Phase 6: Polish & Testing
18. Add keyboard navigation
19. Add accessibility improvements
20. Write unit tests
21. Create comprehensive examples
22. Document all features

---

## Summary

### What Makes This Table Component Great?

1. **Progressive Enhancement**: Start with a basic table, add features as needed
2. **Flexibility**: Support both client-side and server-side operations
3. **Type Safety**: Full TypeScript support with generics
4. **Customizable**: Custom renderers, toolbar actions, and more
5. **Persistent State**: Column visibility saved to localStorage
6. **Accessible**: ARIA labels and keyboard navigation
7. **Performance**: Efficient rendering with TanStack Table
8. **Developer Experience**: Clean API, easy to use

### Quick Start Checklist

When using the DataTable component, ask yourself:

- [ ] Do I need pagination? → Set `enablePagination`
- [ ] Do I need sorting? → Set `enableSorting`
- [ ] Do I need search? → Set `enableSearch` + `searchFields`
- [ ] Is data fetched server-side? → Set `manualPagination`, `manualSorting`, `manualSearch`
- [ ] Do I want to persist column visibility? → Set `storageKey`
- [ ] Do I need custom toolbar actions? → Use `toolbarActions` prop
- [ ] Do I have custom cell renderers? → Use `cell` property in column definition

### Example: Full-Featured Table

```typescript
<DataTable
  data={users}
  columns={columns}
  enablePagination
  enableSorting
  enableSearch
  searchFields={['name', 'email']}
  storageKey="users-table"
  toolbarActions={<Button>Add User</Button>}
/>
```

That's it! 🚀
