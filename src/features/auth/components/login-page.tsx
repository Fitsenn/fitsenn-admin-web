import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { z } from 'zod';

import { FormRHF } from '@/components/ui/form/form';
import { InputRHF } from '@/components/ui/form/input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at Fleast 6 characters'),
});

// type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  // const navigate = useNavigate();

  // const onSubmit = async (data: LoginFormData) => {
  //   try {
  //     await login(data.email, data.password);
  //     navigate({ to: "/dashboard" });
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  return (
    <Container maxW="md" py={20}>
      <Box bg="bg.panel" p={8} borderRadius="lg" boxShadow="sm">
        <Stack gap={6}>
          <Heading size="lg">Sign In</Heading>
          <Text color="fg.muted">Enter your credentials to access your account</Text>

          <FormRHF
            onSubmit={(values) => {
              console.log({ values });
            }}
            schema={loginSchema}>
            {({ control }) => (
              <>
                <InputRHF control={control} type="email" label="Email Address" name="email" />
                <InputRHF control={control} type="password" label="Password" name="password" />
                <div>
                  <Button type="submit">Log in</Button>
                </div>
              </>
            )}
          </FormRHF>
        </Stack>
      </Box>
    </Container>
  );
};
