// routes/users.$userId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  // Render nothing - parent handles the drawer
  component: () => <></>,
});
