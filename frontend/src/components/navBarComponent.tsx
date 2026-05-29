import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toatsComponent";
import { useState } from "react";

function NavBar() {
    const navigate = useNavigate();

    const {toasts, showToast} = useToast();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async (e: any) => {
        e.preventDefault();
        try {
            await AuthService.logOut();
            navigate('/register');
            
        } catch{
            showToast("Error al intentar cerrar sesión", 'error')
        }
    };
    
    const links = (
        <>
            <li>
                <Link to="/show-characters" onClick={() => setMenuOpen(false)}>
                    Personajes
                </Link>
            </li>
            <li>
                <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                    Perfil
                </Link>
            </li>
            <li>
                <Link to="#" onClick={(e) => { setMenuOpen(false); handleLogout(e); }}>
                    Log Out
                </Link>
            </li>
        </>
    );
 return (
        <div className="navbar bg-base-100 shadow-md">
            <ToastComponent toasts={toasts} />
 
            <div className="flex-1">
                <Link to="/public-lists" className="btn btn-ghost text-xl">WizList</Link>
            </div>
 
            <div className="hidden sm:flex flex-none">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
 
            <div className="sm:hidden flex-none">
                <button
                    className="btn btn-ghost btn-square"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Abrir menú"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {menuOpen && (
                    <ul className="menu absolute right-2 top-14 z-50 bg-base-100 rounded-box shadow-lg w-40 border border-base-300">
                        {links}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default NavBar;