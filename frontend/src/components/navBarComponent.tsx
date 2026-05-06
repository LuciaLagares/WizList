import { Link } from "react-router-dom";

function NavBar(){
    return(
    <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <Link to={'/'} className="btn btn-ghost text-xl">WizList</Link>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
                <li>
                    <Link to={'/register'}>
                    Log Out
                    </Link>
                </li>
                <li>
                    <Link to={'/perfil'}>
                    Profile
                    </Link>
                </li>
            </ul>
        </div>
    </div>
    );
}
export default NavBar;