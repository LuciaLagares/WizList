import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./navBarComponent";
import { ProfileService } from "../services/profileService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toastComponent";

export default function PersonProfile() {
  const { id } = useParams();
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();
  const [datos, setDatos] = useState<any>({ user: null, lists: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProfileService.getOthersProfile(Number(id))
      .then(setDatos)
      .catch(() => {
        showToast("Error al cargar el perfil", "error");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (!datos.user) return <div>No datos</div>;

  const iniciales = datos.user.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <ToastComponent toasts={toasts} />
      <NavBar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <div className="bg-primary text-primary-content w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full">
            <span className="text-xl font-semibold">{iniciales}</span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-bold text-3xl sm:text-4xl">{datos.user.username}</h1>
          </div>
        </section>
        <div className="divider"></div>
        <section>
          <h2 className="font-bold text-xl mb-4">Listas públicas</h2>
          {datos.lists.length === 0 ? (
            <p className="text-base-content/70">No tiene listas públicas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {datos.lists.map((list: any) => (
                <div
                  key={list.id}
                  onClick={() => navigate(`/list/${list.id}`)}
                  className="border border-base-300 rounded-xl p-4 cursor-pointer hover:bg-base-200 transition-colors bg-base-100"
                >
                  <h3 className="font-bold truncate">{list.title}</h3>
                  {list.description && (
                    <p className="text-base-content/70 text-sm mt-1 line-clamp-2">
                      {list.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        <div className="divider"></div>
      </main>
    </div>
  );
}