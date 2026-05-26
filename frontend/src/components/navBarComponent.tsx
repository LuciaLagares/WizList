import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    const handleLogout = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
            if (response.ok) {
                navigate('/register');
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <Link to="/public-lists" className="btn btn-ghost text-xl">WizList</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/show-characters">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M14 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z" /><path strokeLinecap="round" d="M18 10s-3.537 1.5-6 1.5S6 10 6 10m6 2v1.452m0 0a3 3 0 0 0 .476 1.623L15 19m-3-5.548a3 3 0 0 1-.476 1.623L9 19" /></g></svg>
                            Personajes
                        </Link>
                    </li>
                    <li>
                        <Link to="/perfil">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray="28" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"/><path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"/></g></svg>
                            Perfil
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21a9 9 0 1 1 9-9a9 9 0 0 1-9 9m0-16.5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 4.5"/><path fill="currentColor" d="M9 15.75a.74.74 0 0 1-.53-.22a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 1.06l-6 6a.74.74 0 0 1-.53.22"/><path fill="currentColor" d="M15 15.75a.74.74 0 0 1-.53-.22l-6-6a.75.75 0 0 1 1.06-1.06l6 6a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22"/></svg>
                            Log Out
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
        
    );
}

export default NavBar;