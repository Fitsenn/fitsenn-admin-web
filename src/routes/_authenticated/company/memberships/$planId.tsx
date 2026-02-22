import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/company/memberships/$planId')({
  component: () => null,
});
