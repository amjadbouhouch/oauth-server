import { Button, Flex, Space, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { clientService } from 'api/client-service'
import Badge from 'components/Badge'
const Clients = () => {
  const { data, isLoading } = useQuery(['clients'], clientService.list)
  const columns = [
    {
      dataIndex: 'clientId',
      title: () => <Text>Client Id</Text>
    },
    {
      dataIndex: 'name',
      title: () => <Text>Name</Text>
    },
    {
      dataIndex: 'enabled',
      title: () => <Text>Status</Text>,
      render: (enabled = true) => {
        if (enabled) {
          return <Badge color={'green'}>Actif</Badge>
        }
        return <Badge color={'red'}>Inactif</Badge>
      }
    },
    {
      dataIndex: 'x',
      title: () => <Text>Action</Text>
    }
  ]
  return (
    <div>
      <Flex justify={'space-between'} align="center">
        <Title>Clients</Title>
        <Button size="sm"> Add new client</Button>
      </Flex>
      <Space h="lg" />
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={data || []}
      />
    </div>
  )
}

export default Clients
