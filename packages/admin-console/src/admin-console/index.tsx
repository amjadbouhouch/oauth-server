import { AppShell, Text, useMantineTheme } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { userService } from '../api'
import Clients from './Clients'
import Header from './Header'
import SideBar from './SideBar'
import { AdminConsoleContextProvider } from '../context/AdminConsoleContext'

const AdminConsole = ({ match }) => {
  const { url } = match

  const { data, error, isSuccess } = useQuery(
    ['current-user'],
    userService.fetchUserInfo
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
