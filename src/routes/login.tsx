import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { LoginPage } from '@/features/auth';
import { isAuthenticated } from '@/api/auth';

const loginSearchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});
