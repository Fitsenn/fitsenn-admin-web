import { createFileRoute, redirect } from '@tanstack/react-router';

import { isAuthenticated } from '@/api/auth';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({ to: '/login' });
    }

    throw redirect({ to: '/dashboard' });
  },
});
