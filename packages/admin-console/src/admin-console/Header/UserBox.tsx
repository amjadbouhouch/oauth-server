import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons'
import { forwardRef } from 'react'
import { useAdminConsole } from '../../hooks/useAdminConsole'

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string
  name: string
  email: string
  icon?: React.ReactNode
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
)
UserButton.displayName = 'UserButton'

const UserBox = () => {
  const { user } = useAdminConsole()
  function logout() {
    localStorage.clear()
    location.reload()
  }
  return (
    <Group position="center">
      <Menu withArrow>
        <Menu.Target>
          <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name={`${user.firstName} ${user.lastName}`}
            email={user.email}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Admin console</Menu.Label>
          <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={logout} icon={<IconLogout size={14} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default UserBox
