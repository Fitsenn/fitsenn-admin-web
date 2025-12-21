Feature-based organization:

src/app/ - Application providers and setup
src/features/ - Self-contained feature modules
auth/ - Authentication (login, protected layout, auth logic)
dashboard/ - Dashboard page with stats
users/ - Users management with table
src/components/ - Shared UI components (Chakra wrappers)
src/routes/ - TanStack Router routes (thin wrappers)
src/lib/ - Shared utilities (query-client, router, supabase)
src/types/ - Global types
src/utils/ - Utility functions
