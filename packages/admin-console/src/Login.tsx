import { AuthService } from 'api/auth-service'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button
} from '@mantine/core'
type LoginFormType = {
  email: string
  password: string
}
const Login = () => {
  const { register, handleSubmit, formState } = useForm<LoginFormType>({
    defaultValues: {
      email: 'admin@oauth.com',
      password: 'admin'
    }
  })
  async function onSubmit(data: LoginFormType) {
    try {
      const authService = new AuthService()
      const response = await authService.authenticate(data)
      localStorage.setItem('token', response.access_token)
      location.reload()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Admin Console
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          {...register('email', { required: true })}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...register('password', { required: true })}
          required
          mt="md"
        />
        <Group position="apart" mt="lg">
          <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
          <Anchor<'a'>
            onClick={(event) => event.preventDefault()}
            href="#"
            size="sm"
          >
            Forgot password?
          </Anchor>
        </Group>
        <Button
          loading={formState.isSubmitting}
          onClick={handleSubmit(onSubmit)}
          fullWidth
          mt="xl"
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}

export default Login
