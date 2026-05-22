import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./navBarComponent";

export default function PersonProfile(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [datos, setDatos] = useState<any>({ usuario: null, listas: [] });
    
    useEffect(() =>{
        fetch(`http://localhost:5000/${id}/perfil`)
        .then(res => res.json())
        .then(setDatos)
    }, [id]);
    
    if(!datos.usuario) return <div> No datos</div>
    
    const iniciales = datos.usuario.username.slice(0,2).toUpperCase();

      return (
    <div className="flex flex-col min-h-screen mx-6">
      <NavBar />
      <section className="p-6">
        <div className="flex items-center gap-4 mb-7">
          <div className="avatar avatar-placeholder">
            <div className="bg-red-200 text-black w-16 flex items-center justify-center rounded-full">
              <span className="text-lg">{iniciales}</span>
            </div>
          </div>
          <h1 className="font-bold text-4xl">{datos.usuario.username}</h1>
        </div>
      </section>

      <section className="px-6">
        <h2 className="font-bold text-xl mb-4">Listas públicas</h2>
        {datos.listas.length === 0 ? (
          <p className="text-gray-500">No tiene listas públicas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {datos.listas.map((lista: any) => (
              <div
                key={lista.id}
                onClick={() => navigate(`/list/${lista.id}`)}
                className="border rounded-xl p-4 cursor-pointer"
              >
                <h3 className="font-bold">{lista.title}</h3>
                {lista.description && <p className="text-gray-500 text-sm">{lista.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}