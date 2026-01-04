import { createFileRoute, redirect } from '@tanstack/react-router';

import { paths } from '@/config/paths';
import { ProtectedLayout, isAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({ to: paths.auth.login.getHref() });
    }
  },
  component: ProtectedLayout,
});
