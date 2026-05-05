import { Link } from "react-router-dom";

function NavBar(){
    return(
    <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
                <li>
                    <Link to={'/register'}>
                    Log Out
                    </Link>
                </li>
                <li><a>Profile</a></li>
            </ul>
        </div>
    </div>
    );
}
export default NavBar;