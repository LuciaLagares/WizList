import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "./navBarComponent"
import { ProfileService } from "../services/profileService"
import { RatingService } from "../services/ratingService"
import { ListService } from "../services/listService"
import { useToast } from "../hooks/useToast"
import ToastComponent from "./toatsComponent"

interface user {
  id:       number
  username: string
  email:    string
  rol:      "normal" | "admin"
}
interface Personaje {
  id:        string
  name:    string
  house:      string | null
  image: string | null
}
interface Lista {
  id: number
  title: string
  description: string
  is_public: boolean
  is_favorite: boolean
  items:{house: string}[]
}

interface Valoracion {
  id:          number
  rate:        number
  character:   Personaje | null
  spell_id:    string | null
}
interface PerfilData {
  usuario: user
  listas: Lista[]
  valoraciones: Valoracion[]
}
function Perfil(){
    const [data, setData]= useState<PerfilData | null>(null)
    const [loading, setLoading] = useState(true); 
    const [editModal, setEditModal] = useState<Valoracion | null>(null)
    const [deleteModal, setDeleteModal] =  useState<Valoracion | null>(null)
    const [deleteModalList, setDeleteModalList] = useState<Lista | null>(null)
    const [editRate, setEditRate] = useState(0)

    const {toasts, showToast} = useToast();

    const navigate = useNavigate()

    useEffect(() => {
        ProfileService.getOwnProfile()
        .then(setData)
        .catch((err) => {
            if (err.message === "NO_AUTH") navigate("/login");
        })
        .finally(() => setLoading(false));
    }, [navigate]);
  
  const openEditModal = (valoracion : Valoracion) => {
    setEditModal(valoracion)
    setEditRate(valoracion.rate)
  }
  
  const handleEdit = () => {
    if(!editModal) return;
    RatingService.updateRate(editModal.id, editRate)
        .then(() => {
            setData(prev => prev ? {
                ...prev,
                valoraciones: prev.valoraciones.map(v =>
                    v.id === editModal.id ? { ...v, rate: editRate } : v
                )
            } : prev)
            setEditModal(null)
            showToast("Valoración actualizada", 'success')
        })
        .catch(() => showToast("Error al actualizar la valoracion", 'error'))
  }

const handleDelete = () => {
  if(!deleteModal) return;
  RatingService.deleteRate(deleteModal.id)
        .then(() => {
            setData(prev => prev ? {
                ...prev,
                valoraciones: prev.valoraciones.filter(v => v.id !== deleteModal.id)
            } : prev)
            setDeleteModal(null)
            showToast("Valoración borrada con éxito", 'success')
        })
        .catch(() => showToast("Error al eliminar la valoracion", 'error'))
}

const handleDeleteList = () => {
  if(!deleteModalList) return;
  ListService.deleteList(deleteModalList.id)
        .then(() => {
            setData(prev => prev ? {
                ...prev,
                listas: prev.listas.filter(l => l.id !== deleteModalList.id)
            } : prev)
            setDeleteModalList(null)
            showToast("Lista borrada con éxito", 'success')
        })
        .catch(() => showToast("Error al eliminar la lista", 'error'))
}

const handleToggleFavorite = (listId: number) => {
    ListService.selectFavorites(listId)
        .then(updated => {
            setData(prev => prev ? {
                ...prev,
                listas: prev.listas.map(l => l.id === listId ? { ...l, is_favorite: updated.is_favorite } : l)
            } : prev)
        })
        .catch(() => showToast("Error al actualizar favorito", 'error'))
}
if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span> {/* Si usas daisyUI */}
      <p>Cargando tu perfil mágico...</p>
    </div>
  );
}
if(!data) return <div>Error al cargar el perfil</div>
const iniciales = data.usuario.username.slice(0, 2).toUpperCase()

const houses : Record<string, number> = {}
data.listas.forEach(lista =>{
  (lista.items || []).forEach((item: {house: string})=>{
    if(item.house) houses[item.house] = (houses[item.house]?? 0) + 1;
  });
});

const favouriteHouse = Object.entries(houses).sort((a,b) => b[1] - a[1])[0];
   return (
  <main className="flex flex-col gap-3 bg-base-100 min-h-screen">
    <ToastComponent toasts={toasts} />
    <NavBar />

    <section className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-7">
        <div className="bg-primary text-primary-content w-16 h-16 flex items-center justify-center rounded-full shrink-0">
          <span className="text-lg font-semibold">{iniciales}</span>
        </div>
        <div>
          <h1 className="font-bold text-3xl sm:text-4xl">{data.usuario.username}</h1>
          {favouriteHouse && (
            <div className="text-base-content/70 text-sm mt-1">
              Casa más presente en listas: <span className="font-semibold text-secondary">{favouriteHouse[0]}</span> ({favouriteHouse[1]} personajes)
            </div>
          )}
        </div>
      </div>
    </section>

    <div className="divider mx-4 sm:mx-6"></div>

    <section className="px-5 sm:px-8">
      <h2 className="font-bold text-lg mb-3">Mis listas</h2>
      {data.listas.length === 0 ? (
        <p>No tienes listas todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.listas.map(lista => (
            <div
              key={lista.id}
              className="flex items-center gap-2 border border-base-300 bg-base-100 rounded-lg p-5"
            >
              <span
                className="font-bold cursor-pointer flex-1 truncate"
                onClick={() => navigate(`/list/${lista.id}`)}
              >
                {lista.title}
              </span>
              <span className={`badge shrink-0 ${lista.is_public ? "badge-success" : "badge-error"}`}>
                {lista.is_public ? "pública" : "privada"}
              </span>
              <button onClick={() => handleToggleFavorite(lista.id)} className="shrink-0 text-lg">
                {lista.is_favorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="#b0b0b0" fill-opacity="0" d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z">
                      <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1" />
                    </path>
                    <path fill="none" stroke="#b0b0b0" stroke-dasharray="30" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9">
                      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="30;0" />
                    </path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="none" stroke="#b0b0b0" stroke-dasharray="30" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9">
                      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="30;0" />
                    </path>
                  </svg>
                )}
              </button>
              <button onClick={() => setDeleteModalList(lista)} className="shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="#b0b0b0" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                </svg>
              </button>
            </div>
          ))}
          {deleteModalList && (
            <dialog open className="modal modal-open">
              <div className="modal-box w-11/12 max-w-md">
                <h3 className="font-bold text-lg mb-2">¿Eliminar lista?</h3>
                <p>¿Seguro que quieres eliminar la lista <span className="font-semibold">{deleteModalList.title}</span>?</p>
                <div className="modal-action">
                  <button className="btn btn-error" onClick={handleDeleteList}>Eliminar</button>
                  <button className="btn" onClick={() => setDeleteModalList(null)}>Cancelar</button>
                </div>
              </div>
              <div className="modal-backdrop" onClick={() => setDeleteModalList(null)} />
            </dialog>
          )}
        </div>
      )}
    </section>

    <div className="divider mx-4 sm:mx-6"></div>

    <section className="px-4 sm:px-6 pb-8">
      <h2 className="font-bold text-lg mb-3">Mis valoraciones</h2>
      {data.valoraciones.length === 0
        ? <p>No has valorado nada todavía.</p>
        : <div className="flex flex-col gap-3">
            {data.valoraciones.map((v) => (
              <div key={v.id} className="flex items-center gap-3 border border-base-300 rounded-lg p-3">
                <img className="w-10 h-12 object-cover rounded shrink-0" src={v.character?.image || "../../images/image_not_provided.png"} alt={v.character?.name} />
                <span className="flex-1 truncate">{v.character?.name}</span>
                <span className="shrink-0 text-sm">{"★".repeat(v.rate)}{"☆".repeat(5 - v.rate)}</span>
                <button onClick={() => openEditModal(v)} className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <g fill="none" stroke="#b0b0b0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path strokeDasharray="44" strokeDashoffset="44" d="M7 17v-4l10 -10l4 4l-10 10h-4">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.5s" to="0" />
                      </path>
                      <path strokeDasharray="20" d="M3 21h18">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0" />
                      </path>
                      <path strokeDasharray="8" strokeDashoffset="8" d="M14 6l4 4"></path>
                    </g>
                  </svg>
                </button>
                <button onClick={() => setDeleteModal(v)} className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="#b0b0b0" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
      }
    </section>

    {editModal && (
      <dialog open className="modal modal-open">
        <div className="modal-box w-11/12 max-w-md">
          <h3 className="font-bold text-lg mb-4">Editar valoración de {editModal.character?.name}</h3>
          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                className={`text-2xl ${n <= editRate ? "text-secondary" : "text-base-content/40"}`}
                onClick={() => setEditRate(n)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleEdit}>Guardar</button>
            <button className="btn" onClick={() => setEditModal(null)}>Cancelar</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setEditModal(null)} />
      </dialog>
    )}

    {deleteModal && (
      <dialog open className="modal modal-open">
        <div className="modal-box w-11/12 max-w-md">
          <h3 className="font-bold text-lg mb-2">¿Eliminar valoración?</h3>
          <p>¿Seguro que quieres eliminar la valoración de <span className="font-semibold">{deleteModal.character?.name}</span>?</p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDelete}>Eliminar</button>
            <button className="btn" onClick={() => setDeleteModal(null)}>Cancelar</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)} />
      </dialog>
    )}
  </main>
)
}
export default Perfil;