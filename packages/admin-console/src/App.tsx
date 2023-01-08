import AdminConsole from 'admin-console'
import { queryClient } from 'api'
import GuardedRoute from 'components/GuardedRoute'
import Login from 'Login'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const accessToken = localStorage.getItem('token')
const App = () => {
  // just for test
  const isLoggedIn = Boolean(accessToken)
  return (
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
          <Route path="/">
            <Redirect to={isLoggedIn ? '/admin-console' : '/login'} />
          </Route>
        </Switch>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
