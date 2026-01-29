import {
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
import { LogOut, Settings, UserCog } from 'lucide-react';

import { useLogout } from '@/api/auth';
import { useUser } from '@/hooks/use-user';
import { Avatar } from '../ui/avatar';

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
          <Avatar url={user?.avatar_url} />
        </Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="200px">
            <Box px={3} py={2}>
              <Flex align="center" gap={3}>
                <Avatar url={user?.avatar_url} />
                <div>
                  <Text fontWeight="medium">{displayName}</Text>
                  <Text fontSize="xs">{user?.email}</Text>
                </div>
              </Flex>
            </Box>
            <MenuSeparator />
            <MenuItem value="account" onClick={() => navigate({ to: '/account' })} cursor="pointer">
              <Icon boxSize={4}>
                <UserCog />
              </Icon>
              <Text>{t('account.title')}</Text>
            </MenuItem>
            <MenuItem value="settings" onClick={() => navigate({ to: '/settings' })} cursor="pointer">
              <Icon boxSize={4}>
                <Settings />
              </Icon>
              <Text>{t('common.settings')}</Text>
            </MenuItem>
            <MenuItem value="logout" onClick={handleLogout} cursor="pointer">
              <Icon boxSize={4}>
                <LogOut />
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
