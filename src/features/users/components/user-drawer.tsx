import { Suspense, lazy, useEffect } from 'react';

import { CloseButton, Drawer, Portal, Spinner, useDisclosure } from '@chakra-ui/react';
import { useMatch, useNavigate } from '@tanstack/react-router';

const UserDrawerContent = lazy(() =>
  import('./user-drawer/user-drawer-content').then((module) => ({ default: module.UserDrawerContent })),
);

const UserDrawer = () => {
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
    } else {
      onClose();
    }
  }, [userId, onOpen, onClose]);

  const handleClose = () => {
    navigate({ to: '/users' });
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          handleClose();
        }
      }}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW="6xl" bg="bg.subtle">
            <Drawer.Body>
              {open && userId && (
                <Suspense fallback={<Spinner />}>
                  <UserDrawerContent userId={userId} />
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

export { UserDrawer };
