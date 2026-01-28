import { Suspense, lazy, useEffect } from 'react';

import { CloseButton, Drawer, Portal, Spinner, useDisclosure } from '@chakra-ui/react';
import { useMatch, useNavigate } from '@tanstack/react-router';

const UserDetailsContent = lazy(() =>
  import('./user-details-drawer/user-details-content').then((module) => ({ default: module.UserDetailsContent })),
);

const UserDetailsDrawer = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const userMatch = useMatch({
    from: '/_authenticated/users/$userId',
    shouldThrow: false,
  });

  const userId = userMatch?.params?.userId;

  useEffect(() => {
    if (userId) {
      onOpen();
    }
  }, [userId, onOpen]);

  const handleClose = () => {
    navigate({ to: '/users' });
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      size="xl"
      onOpenChange={(details) => {
        if (!details.open) {
          handleClose();
        }
      }}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body>
              {open && userId && (
                <Suspense fallback={<Spinner />}>
                  <UserDetailsContent userId={userId} />
                </Suspense>
              )}
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export { UserDetailsDrawer };
