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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/public-lists?page=${page}&per_page=3`)
      .then(res => res.json())
      .then(data => {

        setListas(data.listas);
        setTotalPages(data.pages)
        setLoading(false);
      });
  }, [page]);

  if (loading) return (
    <div className="flex justify-center mt-10">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen mx-6 bg-base-100">
      <NavBar />
      <h1 className="text-3xl font-bold mt-8 mb-6">Listas públicas</h1>

      {listas.length === 0 ? (
        <p className="text-base-content/70">No hay listas públicas todavía.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            {listas.map(lista => (
              <div key={lista.id} className="border border-base-300 rounded-xl p-5 bg-base-100">
                <div
                  className="flex items-center gap-3 mb-3 cursor-pointer"
                  onClick={() => navigate(`/${lista.user_id}/perfil`)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                    {lista.username.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm">{lista.username}</p>
                </div>
                <h2 className="font-bold text-lg">{lista.title}</h2>
                {lista.description && (
                  <p className="text-base-content/70 text-sm mt-1">{lista.description}</p>
                )}
                <div
                  className="mt-3 text-xs text-secondary font-medium cursor-pointer"
                  onClick={() => navigate(`/list/${lista.id}`)}
                >
                  Ver lista
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8 mb-6">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Anterior
            </button>
            <span className="text-sm text-base-content/70">
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
