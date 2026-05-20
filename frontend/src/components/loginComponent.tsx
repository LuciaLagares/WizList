import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            if (response.ok) {
                const res = await response.json();
                alert(res.message);
            } else if (response.status === 401) {
                alert('Usuario o contraseña incorrectos');
            } else {
                alert('Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error de conexión');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
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
                                <Link to={'/show-characters'}>
                                Iniciar sesión
                                </Link>
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