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
import { useTranslation } from 'react-i18next';
import { LuLogOut, LuSettings, LuUser, LuUserCog } from 'react-icons/lu';

import { useLogout } from '@/api/auth';
import { useUser } from '@/hooks/use-user';

const ProfileDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const { user } = useUser();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' });
      },
    });
  };

  const displayName = user?.first_name + ' ' + user?.last_name;

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost" p={1} borderRadius="full" cursor="pointer">
          <Avatar.Root size="sm">
            {user?.avatar_url ? (
              <Avatar.Image src={user.avatar_url} alt={displayName} />
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
                  {user?.avatar_url ? (
                    <Avatar.Image src={user.avatar_url} alt={displayName} />
                  ) : (
                    <Avatar.Fallback>
                      <Icon boxSize={5}>
                        <LuUser />
                      </Icon>
                    </Avatar.Fallback>
                  )}
                </Avatar.Root>
                <div>
                  <Text fontWeight="medium">{displayName}</Text>
                  <Text fontSize="xs">{user?.email}</Text>
                </div>
              </Flex>
            </Box>
            <MenuSeparator />
            <MenuItem value="account" onClick={() => navigate({ to: '/account' })} cursor="pointer">
              <Icon boxSize={4}>
                <LuUserCog />
              </Icon>
              <Text>{t('account.title')}</Text>
            </MenuItem>
            <MenuItem value="settings" onClick={() => navigate({ to: '/settings' })} cursor="pointer">
              <Icon boxSize={4}>
                <LuSettings />
              </Icon>
              <Text>{t('common.settings')}</Text>
            </MenuItem>
            <MenuItem value="logout" onClick={handleLogout} cursor="pointer">
              <Icon boxSize={4}>
                <LuLogOut />
              </Icon>
              <Text>{t('common.logOut')}</Text>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

export { ProfileDropdown };
