import { createFileRoute, redirect } from '@tanstack/react-router';

import { ProtectedLayout } from '@/features/auth';
import { isAuthenticated } from '@/api/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: '/login',
        search: { redirectTo: location.pathname },
      });
    }
  },
  component: ProtectedLayout,
});
