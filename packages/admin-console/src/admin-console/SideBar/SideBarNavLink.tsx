import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

interface SideBarNavLinkProps {
  icon: React.ReactNode
  color: string
  label: string
  to: string
}

function SideBarNavLink({ icon, color, label, to }: SideBarNavLinkProps) {
  const history = useHistory()
  // const isActive = path === to

  return (
    <UnstyledButton
      onClick={() => history.push(to)}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
        }
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}
export default SideBarNavLink
