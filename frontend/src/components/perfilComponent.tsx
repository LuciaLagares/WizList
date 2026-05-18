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
  id:        number
  nombre:    string
  casa:      string | null
  especie:   string | null
  actor:     string | null
  imagen_url: string | null
}
interface Lista {
  id:          number
  nombre:      string
  visibilidad: "publica" | "privada"
}

interface Valoracion {
  personaje:  Personaje
  puntuacion: number
}
interface PerfilData {
  usuario: user
  listas:       Lista[]
  valoraciones: Valoracion[]
}
function Perfil(){
    const [data, setData]= useState<PerfilData | null>(null)
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate()

    useEffect(() => {
    fetch("http://localhost:5000/perfil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return null;
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
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span> {/* Si usas daisyUI */}
        <p>Cargando tu perfil mágico...</p>
      </div>
    );
  }
  if(!data) return <div>Error al cargar el perfil</div>

    return (
      <main className="perfil">
      <NavBar />

      <section className="perfil__header">
        <div>
          <h1 className="font-bold text-4xl text-black">{data.usuario.username}</h1>
        </div>
      </section>

      <section className="perfil__listas">
        <h2>Mis listas</h2>
        {data.listas.length === 0
          ? <p>No tienes listas todavía.</p>
          : data.listas.map(lista => (
              <div key={lista.id} className="lista-card">
                <span>{lista.nombre}</span>
                <span className={`badge badge--${lista.visibilidad}`}>{lista.visibilidad}</span>
              </div>
            ))
        }
      </section>

      <section className="perfil__valoraciones">
        <h2>Mis valoraciones</h2>
        {data.valoraciones.length === 0
          ? <p>No has valorado nada todavía.</p>
          : data.valoraciones.map(({ personaje, puntuacion }) => (
              <div key={personaje.id} className="valoracion-item">
                <img src={personaje.imagen_url || "/placeholder.webp"} alt={personaje.nombre} />
                <span>{personaje.nombre}</span>
                <span className="estrellas">{"★".repeat(puntuacion)}{"☆".repeat(5 - puntuacion)}</span>
              </div>
            ))
        }
      </section>

    </main>
  )
}
export default Perfil;