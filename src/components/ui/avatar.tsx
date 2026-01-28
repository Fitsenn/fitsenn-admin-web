import type { AvatarRootProps } from '@chakra-ui/react';

import { Avatar as AvatarChakra, Icon } from '@chakra-ui/react';
import { LuUser } from 'react-icons/lu';

type AvatarProps = {
  url?: string | null;
  size?: AvatarRootProps['size'];
};
const Avatar = ({ url, size = 'sm' }: AvatarProps) => {
  return (
    <AvatarChakra.Root size={size}>
      {url ? (
        <AvatarChakra.Image src={url} alt="Avatar" />
      ) : (
        <AvatarChakra.Fallback>
          <Icon boxSize={5}>
            <LuUser />
          </Icon>
        </AvatarChakra.Fallback>
      )}
    </AvatarChakra.Root>
  );
};

export { Avatar };
