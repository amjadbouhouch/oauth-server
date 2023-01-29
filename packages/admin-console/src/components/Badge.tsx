import { Badge as MBadge, BadgeProps } from '@mantine/core'

const Badge = ({ children, ...others }: BadgeProps) => {
  return (
    <MBadge
      style={{
        textTransform: 'none'
      }}
      className="lowercase"
      {...others}
    >
      {children}
    </MBadge>
  )
}
export default Badge
