import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from "./components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Home from './pages/Home'
import Project from './pages/Project'
import NotFound from './pages/NotFound'

// Refer to line 10 in 'ClientRow.js' file. When using the memory cache there is a warning that is prompted with data being inconsistent with the the client's/user's data.
//This is to merge it with, im assuming the server data through a merge so everyone's data is consistent with one anothers
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      }
    }
  }
})

const client = new ApolloClient({ 
  uri: 'http://localhost:5000/graphql',
  cache: cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/projects/:id' element={<Project />} />
              <Route path='/*' element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
    
  );
}

export default App;
