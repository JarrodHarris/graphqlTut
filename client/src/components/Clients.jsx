import { useQuery } from '@apollo/client'
import ClientRow from './ClientRow'
import Spinner from './Spinner';
import { GET_CLIENTS } from '../queries/clientQueries'

export default function Clients() {
    const { loading, error, data } = useQuery(GET_CLIENTS);

    if (loading) return <Spinner />
    if (error) return <p>Something went wrong!!!</p>

    // (table table-hover )bootstrap table, has classNames that aren't in the css file but are a built-in name for bootstrap
    return (
        <>
            {!loading && !error && (
                <table className='table table-hover mt-3'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.clients.map(client => (
                            <ClientRow key={client.id} client={client} />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}
