import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { LuLogOut, LuUser } from 'react-icons/lu';

import { paths } from '@/config/paths';
import { useLogout } from '@/lib/auth';

type ProfileDropdownProps = {
  user: {
    name?: string | null;
    avatar?: string | null;
  } | null;
};

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: paths.auth.login.getHref() });
      },
    });
  };

  const displayName = user?.name ?? 'User';

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost" p={1} borderRadius="full" cursor="pointer">
          <Avatar.Root size="sm">
            {user?.avatar ? (
              <Avatar.Image src={user.avatar} alt={displayName} />
            ) : (
              <Avatar.Fallback>
                <Icon boxSize={5}>
                  <LuUser />
                </Icon>
              </Avatar.Fallback>
            )}
          </Avatar.Root>
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="200px">
            <Box px={3} py={2}>
              <Flex align="center" gap={3}>
                <Avatar.Root size="sm">
                  {user?.avatar ? (
                    <Avatar.Image src={user.avatar} alt={displayName} />
                  ) : (
                    <Avatar.Fallback>
                      <Icon boxSize={5}>
                        <LuUser />
                      </Icon>
                    </Avatar.Fallback>
                  )}
                </Avatar.Root>
                <Text fontWeight="medium">{displayName}</Text>
              </Flex>
            </Box>
            <MenuSeparator />
            <MenuItem value="logout" onClick={handleLogout} cursor="pointer">
              <Icon boxSize={4}>
                <LuLogOut />
              </Icon>
              <Text>Log out</Text>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export { ProfileDropdown };
