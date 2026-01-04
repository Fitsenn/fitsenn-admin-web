import { createFileRoute, redirect } from '@tanstack/react-router';

import { paths } from '@/config/paths';
import { isAuthenticated } from '@/lib/auth';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({ to: paths.auth.login.getHref() });
    }

    throw redirect({ to: paths.app.dashboard.getHref() });
  },
});
