import { AppShell, useMantineTheme } from '@mantine/core'
import useTitle from 'hooks/useTitle'
import { useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AdminConsoleContextProvider } from '../context/AdminConsoleContext'
import Clients from './Clients'
import Header from './Header'
import SideBar from './SideBar'

const AdminConsole = ({ match }) => {
  useTitle('Console')

  const { url } = match

  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  function toggleSideBar() {
    setOpened((prev) => !prev)
  }

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
