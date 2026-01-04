import { createFileRoute, redirect } from '@tanstack/react-router';

import { paths } from '@/config/paths';
import { LoginPage } from '@/features/auth';
import { isAuthenticated } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      throw redirect({ to: paths.app.dashboard.getHref() });
    }
  },
  component: LoginPage,
});
