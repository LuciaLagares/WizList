import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBarComponent";

interface ListaPublica {
  id: number;
  title: string;
  description: string;
  user_id: number;
  username: string;
}

export default function PublicLists() {
  const [listas, setListas] = useState<ListaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/public-lists")
      .then(res => res.json())
      .then(data => {
        setListas(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center mt-10">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen mx-6">
      <NavBar />
      <h1 className="text-3xl font-bold mt-8 mb-6">Listas públicas</h1>

      {listas.length === 0 ? (
        <p className="text-gray-500">No hay listas públicas todavía.</p>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
          {listas.map(lista => (
            <div
              key={lista.id}
              className="border rounded-xl p-5 bg-white"
            >
              <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/${lista.user_id}/perfil`)}>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {lista.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{lista.username}</p>
                </div>
              </div>

              <h2 className="font-bold text-lg">{lista.title}</h2>
              {lista.description && (
                <p className="text-gray-500 text-sm mt-1">{lista.description}</p>
              )}
              <div className="mt-3 text-xs text-indigo-500 font-medium cursor-pointer" onClick={() => navigate(`/list/${lista.id}`)}>
                Ver lista
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}