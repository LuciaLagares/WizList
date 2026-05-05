import { useState } from "react";
import { Link } from "react-router-dom";

function Registrer(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any) => {
    e.preventDefault();

    const datosParaEnviar = { 
    username: username, 
    password: password 
  };
  try{
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar) 
      });
      if(response.ok){
        const res = await response.json();
        alert(res.message);
      }else{
        alert("Error al registrar");
      }
    }catch(error){
        console.error('Error de conexión');
    } 
  };
  return(
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      {/* Tarjeta de DaisyUI */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">WizList Register</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input de Usuario */}
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

            {/* Input de Contraseña */}
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

            {/* Botón con efecto de DaisyUI */}
            <div className="card-actions justify-end mt-6">
                <Link to={`/api/characters`}>
                    <button type="submit" className="btn btn-primary w-full">
                        Registrarse
                    </button>
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Registrer;

