import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBarComponent";
import { ListService } from "../services/listService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toastComponent";

interface ListaPublica {
  id: number;
  title: string;
  description: string;
  user_id: number;
  username: string;
}

export default function PublicLists() {
  const {toasts, showToast} = useToast();
  const [lists, setLists] = useState<ListaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    ListService.getAllPublicLists(page, 3)
        .then(data => {
            setLists(data.lists);
            setTotalPages(data.pages);
        })
        .catch(() => showToast("Error cargando las listas", 'error'))
        .finally(() => setLoading(false));
}, [page]);

  if (loading) return (
    <div className="flex justify-center mt-10">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <ToastComponent toasts={toasts} />
      <NavBar />
 
      <div className="px-4 sm:px-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mt-8 mb-6">Listas públicas</h1>
 
        {lists.length === 0 ? (
          <p className="text-base-content/70">No hay listas públicas todavía.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {lists.map(lista => (
                <div key={lista.id} className="border border-base-300 rounded-xl p-4 sm:p-5 bg-base-100 flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div
                      className="flex items-center gap-3 mb-3 cursor-pointer"
                      onClick={() => navigate(`/${lista.user_id}/profile`)}
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-xs sm:text-sm shrink-0">
                        {lista.username.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="font-semibold text-sm truncate">{lista.username}</p>
                    </div>
                    <h2 className="font-bold text-base sm:text-lg">{lista.title}</h2>
                    {lista.description && (
                      <p className="text-base-content/70 text-sm mt-1 line-clamp-2">{lista.description}</p>
                    )}
                    <div
                      className="mt-3 text-xs text-secondary font-medium cursor-pointer"
                      onClick={() => navigate(`/list/${lista.id}`)}
                    >
                      Ver lista →
                    </div>
                  </div>
                </div>
              ))}
            </div>
 
            <div className="flex justify-center items-center gap-4 mt-8 mb-6">
              <button className="btn btn-primary btn-sm sm:btn-md" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Anterior
              </button>
              <span className="text-sm text-base-content/70">
                {page} / {totalPages}
              </span>
              <button className="btn btn-primary btn-sm sm:btn-md" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
