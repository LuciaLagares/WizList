import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toatsComponent";

function Login() {
    const { toasts, showToast } = useToast();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await AuthService.login(username, password);
            navigate("/show-characters");
            showToast("Login correcto!", 'success')
        } catch { 
            showToast("Error al loggearte", 'error');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-100">
            <ToastComponent toasts={toasts} />
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold">WizList Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nombre de mago/bruja</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: HarryP"
                                className="input input-bordered w-full"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Contraseña mágica</span>
                            </label>
                            <input
                                type="password"
                                placeholder="*****"
                                className="input input-bordered w-full"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button type="submit" className="btn btn-primary w-full">
                                Iniciar sesión
                            </button>
                        </div>

                        <p className="text-center text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-primary underline">
                                Regístrate
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;