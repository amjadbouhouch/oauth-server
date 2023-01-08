import AdminConsole from 'admin-console'
import GuardedRoute from 'components/GuardedRoute'
import Login from 'Login'
import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

const isLoggedIn = false
const App = () => {
  return (
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
  )
}

export default App
