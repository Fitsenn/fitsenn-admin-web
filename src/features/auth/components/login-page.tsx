import type { LoginFormData } from './login-page.schema';

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLogin } from '@/api/auth';
import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { loginValidationSchema } from './login-page.schema';

const routeApi = getRouteApi('/login');

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { redirectTo } = routeApi.useSearch();
  const loginMutation = useLogin();

  const methods = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginValidationSchema),
  });

  const { control } = methods;

  const handleSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (result) => {
        if (!result.error) {
          navigate({ to: redirectTo ?? '/' });
        }
      },
    });
  };

  const error = loginMutation.data?.error ?? (loginMutation.error ? t('auth.unexpectedError') : null);

  return (
    <Container maxW="md" py={20}>
      <Box bg="bg.panel" p={8} borderRadius="lg" boxShadow="sm">
        <Stack gap={6}>
          <Heading size="lg">{t('auth.signIn')}</Heading>
          <Text color="fg.muted">{t('auth.enterCredentials')}</Text>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <InputRHF control={control} label={t('auth.emailAddress')} name="email" />
            <InputRHF control={control} type="password" label={t('auth.password')} name="password" />
            <Button
              colorPalette="brand"
              type="submit"
              w="100%"
              mt="2"
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}>
              {t('auth.logIn')}
            </Button>
          </FormRHF>
        </Stack>
      </Box>
    </Container>
  );
};

export { LoginPage };
