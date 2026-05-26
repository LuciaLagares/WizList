import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./navBarComponent";

interface Spell {
  name: string
  description: string
}

interface Item {
  tipo: "character" | "spell";
  id: string;
  name: string;
  house?: string;
  image?: string;
  description?: string;
  spells: Spell[]
}

interface DetailList {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  user_id: number;
  username: string;
  items: Item[];
}

export default function DetailList(){
    const { id } = useParams();
    const [lista, setLista] = useState<DetailList | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() =>{
        fetch(`http://localhost:5000/list/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        .then((res) => {
            if(!res.ok) throw new Error("Error al cargar la lista");
            return res.json();
        })
        .then((data) => setLista(data))
        setLoading(false);
    }, [id]);

    if(loading) return <div>Cargando tu lista...</div>
    if(!lista) return <div>Error al cargar tu lista</div>

return (
  <div className="flex flex-col min-h-screen mx-6 bg-base-100">
    <NavBar />

    <div className="mt-8 mb-4">
      <h1 className="text-4xl font-bold">{lista.title}</h1>
      <h2 className="text-xl font-semibold text-base-content">{lista.username}</h2>
      {lista.description && <p className="text-base-content/70 mt-2">{lista.description}</p>}
      <span className={`badge mt-2 ${lista.is_public ? "badge-success" : "badge-error"}`}>
        {lista.is_public ? "pública" : "privada"}
      </span>
    </div>

    {lista.items.length > 0 && (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Personajes</h2>
        <div className="carousel carousel-center gap-4 p-4 bg-base-200 rounded-box">
          {lista.items.map((item) => (
            <div key={item.id} className="carousel-item">
              <div className="card w-48 bg-base-100 shadow-md">
                <figure>
                  <img
                    src={item.image || "/images/image_not_provided.png"}
                    alt={item.name}
                    className="w-48 h-56 object-cover"
                  />
                </figure>
                <div className="card-body p-3">
                  <h3 className="card-title text-sm">{item.name}</h3>
                  {item.house && <p className="text-xs text-base-content/70">{item.house}</p>}
                </div> 
                {item.spells.length > 0 && (
                    <div>
                        <details className="collapse bg-base-100 border border-base-300" open>
                            <summary className="collapse-title font-semibold">Hechizos</summary>
                            {item.spells.map((s) => (
                                <div className="collapse-content text-sm">{s.name}</div>
                            ))}
                        </details> 
                    </div>
                )}       
              </div> 
            </div>              
          ))}
        </div>
      </section>
    )}

    {lista.items.length === 0 && (
      <p className="text-base-content/70">Esta lista está vacía.</p>
    )}
  </div>
);

}