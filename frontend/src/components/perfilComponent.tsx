import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "./navBarComponent"

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
    const [editRate, setEditRate] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
    fetch("http://localhost:5000/perfil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status===422) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then((data) => {
        if (data) setData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); 
  }, [navigate]);
  
  const openEditModal = (valoracion : Valoracion) => {
    setEditModal(valoracion)
    setEditRate(valoracion.rate)
  }
  
  const handleEdit = () => {
    if(!editModal) return;
    fetch(`http://localhost:5000/valoraciones/${editModal.id}`,{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({rate: editRate})
    })
    .then(() => {
      setData(prev => prev ? {
        ...prev, 
        valoraciones: prev.valoraciones.map((v) => 
          v.id === editModal.id ? {...v, rate: editRate} : v
      )
    }: prev)
    setEditModal(null)
  })
  .catch((e) => console.error(e))
}

const handleDelete = () => {
  if(!deleteModal) return;
  fetch(`http://localhost:5000/valoraciones/${deleteModal.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then((res) => {
    if(!res.ok) throw new Error("Error in deleting")
      setData(prev => prev ? {
    ...prev,
    valoraciones: prev.valoraciones.filter(v => v.id !== deleteModal.id)
  }: prev)
  setDeleteModal(null)
})
.catch((e) => console.error(e))
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
          <div className="avatar avatar-placeholder">
            <div className="bg-primary text-primary-content w-16 flex items-center justify-center rounded-full">
              <span className="text-lg">{iniciales}</span>
            </div>
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
              <div
                key={lista.id}
                onClick={() => navigate(`/list/${lista.id}`)}
                className="flex items-center justify-between border border-base-300 bg-base-100 rounded-lg p-4 cursor-pointer"
              >
                <span className="font-bold">{lista.title}</span>
                <span className={`badge ${lista.is_public ? "badge-success" : "badge-error"}`}>
                  {lista.is_public ? "pública" : "privada"}
                </span>
              </div>
            ))}
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
                <button onClick={() => openEditModal(v)}>✏️</button>
                <button onClick={() => setDeleteModal(v)}>🗑️</button>
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