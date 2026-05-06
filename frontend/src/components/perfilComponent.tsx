import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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
    const navigate = useNavigate()

    useEffect(() => {
    fetch("http://localhost:5000/perfil", { 
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        },
        credentials: "include" 
    })
      .then(res => {
        if (res.status === 401) { navigate("/login"); return null }
        return res.json()
      })
      .then(data => { if (data) setData(data) })
  }, []);

  if(!data) return <div>Error al cargar el perfil</div>

    return (
    <main className="perfil">

      <section className="perfil__header">
        <div className="perfil__avatar">{data.usuario.username[0].toUpperCase()}</div>
        <div>
          <h1>{data.usuario.username}</h1>
          <p>{data.usuario.email}</p>
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