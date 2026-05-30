import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./navBarComponent";
import { ProfileService } from "../services/profileService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toastComponent";

export default function PersonProfile(){
    const {id} = useParams();
    const {toasts, showToast} = useToast();
    const navigate = useNavigate();
    const [datos, setDatos] = useState<any>({ usuario: null, listas: [] });
    
    useEffect(() =>{
         ProfileService.getOthersProfile(Number(id))
        .then(setDatos)
        .catch(() => showToast("Error al cargar el perfil", 'error'));
}, [id]);
    
    if(!datos.usuario) return <div> No datos</div>
    
    const iniciales = datos.usuario.username.slice(0,2).toUpperCase();

      return (
    <div className="flex flex-col min-h-screen mx-6 bg-base-100">
      <ToastComponent toasts={toasts} />
      <NavBar />
      <section className="p-6">
        <div className="flex items-center gap-4 mb-7">
            <div className="bg-primary text-primary-content w-16 h-16 flex items-center justify-center rounded-full">
              <span className="text-lg font-semibold">{iniciales}</span>
          </div>
          <h1 className="font-bold text-4xl">{datos.usuario.username}</h1>
        </div>
      </section>
      <div className="divider m-6"></div>
      <section className="px-6">
        <h2 className="font-bold text-xl mb-4">Listas públicas</h2>
        {datos.listas.length === 0 ? (
          <p className="text-base-content/70">No tiene listas públicas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {datos.listas.map((lista: any) => (
              <div
                key={lista.id}
                onClick={() => navigate(`/list/${lista.id}`)}
                className="border border-base-300 rounded-xl p-4 cursor-pointer bg-base-100"
              >
                <h3 className="font-bold">{lista.title}</h3>
                {lista.description && <p className="text-base-content/70 text-sm">{lista.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="divider m-6"></div>
    </div>
  );
}