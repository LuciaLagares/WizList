import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "./navBarComponent"
import { ProfileService } from "../services/profileService"
import { RatingService } from "../services/ratingService"
import { ListService } from "../services/listService"

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
}

interface Valoracion {
  id:          number
  rate:        number
  is_favorite: boolean
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
        })
        .catch(console.error)
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
        })
        .catch(console.error)
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
        })
        .catch(console.error)
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

    return (
      <main className="flex flex-col gap-3 bg-base-100 min-h-screen">
      <NavBar />

    <section className="p-6">
        <div className="flex items-center gap-4 mb-7">
            <div className="bg-primary text-primary-content w-16 h-16 flex items-center justify-center rounded-full">
              <span className="text-lg font-semibold">{iniciales}</span>
          </div>
          <h1 className="font-bold text-4xl">{data.usuario.username}</h1>
        </div>
      </section>
      <div className="divider m-6"></div>
     <section className="px-6">
        <h2 className="font-bold text-lg mb-3">Mis listas</h2>
        {data.listas.length === 0 ? (
          <p>No tienes listas todavía.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.listas.map(lista => (
              <>
              <div
                key={lista.id}
                className="flex items-center justify-between border border-base-300 bg-base-100 rounded-lg p-3"
                >
                <span className="font-bold cursor-pointer" onClick={() => navigate(`/list/${lista.id}`)}>{lista.title}</span>
                <button onClick={() => setDeleteModalList(lista)} className="ml-56">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="#b0b0b0" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                  </svg>
                </button>
                <span className={`badge ${lista.is_public ? "badge-success" : "badge-error"}`}>
                  {lista.is_public ? "pública" : "privada"}
                </span>
              </div>
              
              </>
            ))}
            {deleteModalList && (
              <dialog open className="modal modal-open">
                <div className="modal-box">
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
      <div className="divider m-6"></div>
      <section className="px-6">
        <h2 className="font-bold text-lg mb-3">Mis valoraciones</h2>
        {data.valoraciones.length === 0
          ? <p>No has valorado nada todavía.</p>
          : data.valoraciones.map((v) => (
              <div key={v.id} className="flex items-center gap-3 mb-3 flex-wrap">
                <img  className="w-10 h-12 object-cover rounded" src={v.character?.image || "../../images/image_not_provided.png"} alt={v.character?.name} />
                <span>{v.character?.name}</span>
                <span className="estrellas">{"★".repeat(v.rate)}{"☆".repeat(5 - v.rate)}</span>
                <button onClick={() => openEditModal(v)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <g fill="none" stroke="#b0b0b0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <path stroke-dasharray="44" stroke-dashoffset="44" d="M7 17v-4l10 -10l4 4l-10 10h-4">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.5s" to="0" />
                      </path>
                      <path stroke-dasharray="20" d="M3 21h18">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0" />
                      </path>
                      <path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"></path>
                    </g>
                  </svg>
                </button>
                <button onClick={() => setDeleteModal(v)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="#b0b0b0" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                  </svg>
                </button>
              </div>
            ))
        }
      </section>
      {editModal && (
                <dialog open className="modal modal-open">
          <div className="modal-box">
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
          <div className="modal-box">
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