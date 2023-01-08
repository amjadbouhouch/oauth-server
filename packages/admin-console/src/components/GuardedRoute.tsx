import React from 'react'
import { Redirect, Route } from 'react-router-dom'

interface GuardedRouteProps {
  /**
   * When should render the component
   */

  authorized: boolean
  component: React.FC<any>

  /**
   * if not authorized to the component where should be redirected
   */

  redirectTo: string
  path: string
  [x: string]: any
}

const GuardedRoute = ({
  component: Component,
  authorized,
  redirectTo,
  path,
  ...rest
}: GuardedRouteProps) => (
  <Route
    path={path}
    {...rest}
    render={(props) =>
      authorized ? <Component {...props} /> : <Redirect to={redirectTo} />
    }
  />
)

export default GuardedRoute
