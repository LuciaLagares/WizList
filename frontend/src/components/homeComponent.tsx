import { Link } from "react-router-dom"

function Home(){
    return(
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <Link to={'/'} className="btn btn-ghost text-xl">WizList</Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to={'/login'}>Login</Link></li>
                    </ul>
                </div>
            </div>
            <div>Bienvenido a WizList</div>
        </div>
    )
}

export default Home