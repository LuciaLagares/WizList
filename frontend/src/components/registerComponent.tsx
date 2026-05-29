import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";

function Registrer(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        await AuthService.register(username, password);
        navigate('/show-characters');
    } catch (err: any) {
        if (err.message === "El nombre de usuario ya existe") {
            navigate('/login');
        } else {
            alert(err.message);
        }
    }
  };
  
  return(
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">WizList Register</h2>
          
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
                    Registrarse
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Registrer;

