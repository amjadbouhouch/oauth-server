import { AppShell, useMantineTheme } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import useTitle from 'hooks/useTitle'
import { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { userService } from '../api'
import { AdminConsoleContextProvider } from '../context/AdminConsoleContext'
import Clients from './Clients'
import Header from './Header'
import SideBar from './SideBar'

const AdminConsole = ({ match }) => {
  useTitle('Console')

  const { url } = match
  const history = useHistory()
  const { data, error, isSuccess } = useQuery(
    ['current-user'],
    userService.fetchUserInfo,
    {
      onError(err) {
        if (isAxiosError(err)) {
          if (err.response?.status === 401) {
            // logout
            localStorage.clear()
            history.replace('/')
          }
        }
      }
    }
  )
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  function toggleSideBar() {
    setOpened((prev) => !prev)
  }
  if (!isSuccess) return <div>loading</div>
  return (
    <AdminConsoleContextProvider>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0]
          }
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={<SideBar opened={opened} />}
        header={<Header opened={opened} toggleSideBar={toggleSideBar} />}
      >
        <Switch>
          <Route exact path={`${url}`}>
            <Redirect to={`${url}/dashboard`} />
          </Route>
          <Route path={`${url}/dashboard`}>
            <div>dashboard</div>
          </Route>
          <Route path={`${url}/clients`}>
            <Clients />
          </Route>
        </Switch>
      </AppShell>
    </AdminConsoleContextProvider>
  )
}

export default AdminConsole
