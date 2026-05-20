
import { useEffect, useState } from "react";
import type { CharacterProps } from "./cardComponent";
import NavBar from "./navBarComponent";
import { useNavigate, useParams } from "react-router-dom";



function Details(){
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() =>{
        fetch(`http://localhost:5000/character/${id}/spells`)
        .then(res => res.json())
        .then(data => setCharacter(data));
    }, [id]);
    
    const [character, setCharacter] = useState<CharacterProps | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState<{ id: number; title: string }[]>([]);
    const [mensaje, setMensaje] = useState("");
    const [creando, setCreando] = useState(false);
    const [nuevoTitulo, setNuevoTitulo] = useState("");
    
    if(!character) return <div>Loading ....</div>

    const openModal = async () => {
        const res = await fetch("http://localhost:5000/my-lists", {
        credentials: "include",
        });
        if(res.status === 401) navigate("/login")
        const data = await res.json();
        setLists(Array.isArray(data) ? data : []);
        setShowModal(true);
    };

    const addToList = async (listId: number) => {
        const res = await fetch(`http://localhost:5000/list/${listId}/add-character`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            character_id: id,
            character_name: character.name,
            character_house: character.house,
            character_image: character.image,
            spells: character.spells,
      }),
    });
    const data = await res.json();
    setMensaje(data.message || data.error);
    setTimeout(() => {
      setShowModal(false);
      setMensaje("");
    }, 1500);
  };

  const createList = async () => {
    if (!nuevoTitulo.trim()) return;
    const res = await fetch("http://localhost:5000/list", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nuevoTitulo }),
    });
    const nueva = await res.json();
    setLists([...lists, nueva]);
    setCreando(false);
    setNuevoTitulo("");
  };


    return(
        <div className="flex flex-col min-h-screen mx-6">
            <NavBar />
            <div className="flex-1 mb-16 mt-8">
                <h1 className="text-4xl font-bold text-center mb-4">{character.name}</h1>
                <h2 className="text-lg text-gray-500 text-center mb-3">{character.alternate_names?.join(", ")}</h2>
                <div className="flex justify-center">
                    <div className="grid lg:grid-cols-2 md:w-2/3 mt-5 p-5 border-2 border-gray-200 rounded-lg">
                        <div className="p-3 flex flex-col items-center justify-center">
                            <img className="w-full h-full object-cover rounded-lg" src={character.image || '../../images/image_not_provided.png'} alt={character.name} />
                        </div>
                        <div className="py-2">
                            <table className="table-auto">
                                <tbody className="text-left">
                                    <tr>
                                        <th scope="row" className="font-bold">Name</th>
                                        <td className="px-4 py-2 align-top">{character.name}</td>
                                    </tr>

                                    <tr>
                                        <th scope="row" className="font-bold">House</th>
                                        <td className="px-4 py-2 align-top">{character.house}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 className="text-xl font-bold mt-6 mb-3">Hechizos</h3>
                            <ul className="list-disc pl-5">
                            {character.spells?.map((spell, index) => (
                                <li key={index} className="mb-1">
                                <span className="font-semibold">{spell.name}</span> — {spell.description}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                 <div className="card-actions justify-end">
                    <button onClick={openModal} className="btn btn-primary p-5">
                    Add
                    </button>
                </div>
                {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h3 className="text-lg font-bold mb-4">Añadir a una lista</h3>

                {mensaje ? (
                <p className="text-center text-green-600 font-semibold">{mensaje}</p>
                ) : creando ? (
                <div className="flex flex-col gap-2">
                    <input
                    type="text"
                    placeholder="Nombre de la lista"
                    value={nuevoTitulo}
                    onChange={e => setNuevoTitulo(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                    />
                    <button onClick={createList} className="btn btn-primary w-full">
                    Crear
                    </button>
                    <button onClick={() => setCreando(false)} className="text-sm text-gray-400">
                    Cancelar
                    </button>
                </div>
                ) : lists.length === 0 ? (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">No tienes listas creadas.</p>
                    <button onClick={() => setCreando(true)} className="btn btn-primary w-full">
                    Crear lista
                    </button>
                </div>
                ) : (
                <>
                    <ul className="flex flex-col gap-2">
                    {lists.map(list => (
                        <li key={list.id}>
                        <button
                            onClick={() => addToList(list.id)}
                            className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 border border-gray-200"
                        >
                            {list.title}
                        </button>
                        </li>
                    ))}
                    </ul>
                    <button
                    onClick={() => setCreando(true)}
                    className="mt-3 text-sm text-indigo-500 hover:underline w-full text-center"
                    >
                    + Crear nueva lista
                    </button>
                </>
                )}

                <button
                onClick={() => { setShowModal(false); setCreando(false); setMensaje(""); }}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 w-full text-center"
                >
                Cancelar
                </button>
            </div>
            </div>
                )}
        
            </div>
                
            
        
            
        </div>
    )
}
export default Details;