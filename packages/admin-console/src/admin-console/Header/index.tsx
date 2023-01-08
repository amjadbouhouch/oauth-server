import React from 'react'
import {
  Burger,
  Flex,
  Header as Mantineheader,
  MediaQuery,
  Text,
  useMantineTheme
} from '@mantine/core'
import UserBox from './UserBox'
import ToggleTheme from './ToggleTheme'
interface HeaderProps {
  opened: boolean
  toggleSideBar: () => void
}
const Header = ({ opened, toggleSideBar }: HeaderProps) => {
  const theme = useMantineTheme()

  return (
    <Mantineheader height={{ base: 40, md: 60 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={toggleSideBar}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <div style={{ flex: 1, width: '100%' }}>
          <Flex
            mih={50}
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
          >
            <ToggleTheme />
            <UserBox />
          </Flex>
        </div>
      </div>
    </Mantineheader>
  )
}

export default Header
