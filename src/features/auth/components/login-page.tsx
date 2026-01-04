import type { LoginFormData } from './login-page.schema';

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { ColorModeButton } from '@/components/ui/color-mode-button';
import { paths } from '@/config/paths';
import { useLogin } from '../api/login';
import { loginValidationSchema } from './login-page.schema';

const LoginPage = () => {
  const navigate = useNavigate();
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
          navigate({ to: paths.app.dashboard.getHref() });
        }
      },
    });
  };

  const error = loginMutation.data?.error ?? (loginMutation.error ? 'An unexpected error occurred' : null);

  return (
    <Container maxW="md" py={20}>
      <ColorModeButton />
      <Box bg="bg.panel" p={8} borderRadius="lg" boxShadow="sm">
        <Stack gap={6}>
          <Heading size="lg">Sign In</Heading>
          <Text color="fg.muted">Enter your credentials to access your account</Text>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <InputRHF control={control} label="Email Address" name="email" />
            <InputRHF control={control} type="password" label="Password" name="password" />
            <Button type="submit" w="100%" mt="2" loading={loginMutation.isPending} disabled={loginMutation.isPending}>
              Log in
            </Button>
          </FormRHF>
        </Stack>
      </Box>
    </Container>
  );
};

export { LoginPage };
