import logo from './assets/graphql_icon.png'

export default function Header() {
    // mb=margin border, p=padding, setting it to 0 is turning it off
  return (
    <nav className='navbar bg-light mb-4 p-0'>
        <div className='container'>
            <a className="navbar-brand" href="/">
                <div className="d-flex">
                    <img src={logo} alt="logo" className="mr-2" />
                    <div>GraphqlTut</div>
                </div>
            </a>
        </div>
    </nav>
  )
}
