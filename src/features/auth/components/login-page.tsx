import type { LoginFormData } from './login-page.schema';

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { FormRHF } from '@/components/form/form';
import { InputRHF } from '@/components/form/input';
import { loginValidationSchema } from './login-page.schema';

export const LoginPage = () => {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginValidationSchema),
  });

  const { control } = methods;

  const handleSubmit = (data: LoginFormData) => {
    console.log(data);
    navigate({ to: '/dashboard' });
  };

  return (
    <Container maxW="md" py={20}>
      <Box bg="bg.panel" p={8} borderRadius="lg" boxShadow="sm">
        <Stack gap={6}>
          <Heading size="lg">Sign In</Heading>
          <Text color="fg.muted">Enter your credentials to access your account</Text>
          <FormRHF methods={methods} onSubmit={handleSubmit}>
            <InputRHF control={control} label="Email Address" name="email" />
            <InputRHF control={control} type="password" label="Password" name="password" />
            <Button type="submit">Log in</Button>
          </FormRHF>
        </Stack>
      </Box>
    </Container>
  );
};
