import type { DialogRootProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

import { CloseButton, Dialog, Portal } from '@chakra-ui/react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: DialogRootProps['size'];
} & PropsWithChildren;

const Modal = ({ open, onClose, title, description, size = 'md', children }: ModalProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      scrollBehavior="inside"
      size={size}
      motionPreset="slide-in-right"
      lazyMount>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
              {description && <Dialog.Description>{description}</Dialog.Description>}
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

Modal.Body = Dialog.Body;
Modal.Footer = Dialog.Footer;

export { Modal };
