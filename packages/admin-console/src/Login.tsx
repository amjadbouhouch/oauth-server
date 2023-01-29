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
import useTitle from 'hooks/useTitle'
import { QueryBuilder } from 'utils'
type LoginFormType = {
  email: string
  password: string
}
const Login = () => {
  useTitle('Login Page')
  const { register, handleSubmit, formState } = useForm<LoginFormType>({
    defaultValues: {
      email: 'admin@oauth.com',
      password: 'admin'
    }
  })
  // async function onSubmit(data: LoginFormType) {
  //   try {
  //     const authService = new AuthService()
  //     const response = await authService.authenticate(data)
  //     localStorage.setItem('token', response.access_token)
  //     location.reload()
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const redirectToOauth = () => {
    const queryBuilder = new QueryBuilder()
    const fullUrl = queryBuilder
      .setUrl('http://localhost:5000/authorize')
      .setQueryParam('response_type', 'code')
      .setQueryParam('client_id', 'admin-console-client')
      .setQueryParam('redirect_uri', `${window.origin}/oauth`)
      .setQueryParam('scope', 'profile')
      .build()

    location.href = fullUrl
  }
  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text
          align="center"
          sx={(theme) => ({
            fontFamily: `${theme.fontFamily}`,
            fontWeight: 900,
            fontSize: theme.fontSizes.lg
          })}
        >
          Welcome back!
        </Text>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Admin Console
        </Text>
        <Button onClick={redirectToOauth} fullWidth mt="xl">
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}

export default Login
