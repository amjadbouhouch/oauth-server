import { useQuery } from '@tanstack/react-query'
import { clientService } from 'api/client-service'
const Clients = () => {
  const { data } = useQuery(['clients'], clientService.list)
  console.log(data)

  return <div></div>
}

export default Clients
