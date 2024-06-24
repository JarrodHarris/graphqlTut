import { FaTrash } from 'react-icons/fa'
import { useMutation  } from '@apollo/client'
import { DELETE_CLIENT } from '../mutations/clientMutations'
import { GET_CLIENTS } from '../queries/clientQueries' 
import { GET_PROJECTS } from '../queries/projectQueries'

export default function ClientRow({ client }) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: {id: client.id},
        refetchQueries: [{ query: GET_CLIENTS }, {query: GET_PROJECTS}],   //when client is deleted, calls GET_CLIENTS AND get_projects to refresh the table //FIRST OPTION
        // update(cache, { data: { deleteClient } }) {   //OTHERWISE you can change the data through the memory cache and filter the deleted 'client' out of the 'GET_CLIENTS' query. This option is more efficient as the first option calls all the data to GET_CLIENTS and can be costly
        //     const { clients } = cache.readQuery({ query: GET_CLIENTS });
        //     cache.writeQuery({
        //         query: GET_CLIENTS,
        //         data: { clients: clients.filter(client => client.id !== deleteClient.id) },
        //     });
        // }
    });

  return (
    <tr>
        <td>{ client.name }</td>
        <td>{ client.email }</td>
        <td>{ client.phone }</td>
        <td>
            <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                <FaTrash />
            </button>
        </td>
    </tr>
  )
}
