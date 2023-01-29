import AdminConsole from 'admin-console'
import { queryClient } from 'api'
import GuardedRoute from 'components/GuardedRoute'
import Login from 'Login'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider
} from '@mantine/core'
import { useState } from 'react'
import OAuth from 'OAuth'
import AuthProvider from 'context/AuthProvider'
import { useAuth } from 'hooks/useAuth'

const App = () => {
  const { isLoggedIn } = useAuth()
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: 'system-ui'
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Switch>
              <GuardedRoute
                path="/admin-console"
                authorized={isLoggedIn}
                component={AdminConsole}
                redirectTo={'/login'}
              />
              <GuardedRoute
                path="/login"
                authorized={!isLoggedIn}
                component={Login}
                redirectTo={'/admin-console'}
              />
              <GuardedRoute
                path="/oauth"
                authorized={!isLoggedIn}
                component={OAuth}
                redirectTo={'/admin-console'}
              />
              <Route path="/">
                <Redirect to={isLoggedIn ? '/admin-console' : '/login'} />
              </Route>
            </Switch>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
export default AppWrapper
