import React from 'react'
import { Navbar } from '@mantine/core'
import {
  IconMessages,
  IconDatabase,
  IconUsers,
  IconApps,
  IconDashboard
} from '@tabler/icons'
import SideBarNavLink from './SideBarNavLink'

interface SideBarProps {
  opened: boolean
}

const data = [
  {
    icon: <IconDashboard size={16} />,
    color: 'indigo',
    label: 'Dashboard',
    to: '/admin-console/dashboard'
  },
  {
    icon: <IconApps size={16} />,
    color: 'blue',
    label: 'Clients',
    to: '/admin-console/clients'
  },
  {
    icon: <IconUsers size={16} />,
    color: 'teal',
    label: 'Users',
    to: '/admin-console/users'
  },
  // {
  //   icon: <IconMessages size={16} />,
  //   color: 'violet',
  //   label: 'Discussions',
  //   to: '/admin-console/app'
  // },
  {
    icon: <IconDatabase size={16} />,
    color: 'grape',
    label: 'Settings',
    to: '/admin-console/settings'
  }
]
const SideBar = ({ opened }: SideBarProps) => {
  const links = data.map((link) => (
    <SideBarNavLink {...link} key={link.label} />
  ))
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      {links}
    </Navbar>
  )
}

export default SideBar
