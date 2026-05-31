
import { useEffect, useState } from "react";
import type { CharacterProps } from "./cardComponent";
import NavBar from "./navBarComponent";
import { useNavigate, useParams } from "react-router-dom";
import { CharactersService } from "../services/charactersService";
import { AuthService } from "../services/authService";
import { RatingService } from "../services/ratingService";
import { ListService } from "../services/listService";
import { useToast } from "../hooks/useToast";
import ToastComponent from "./toastComponent";



function Details(){
    const {id} = useParams();
    const navigate = useNavigate();

    const {toasts, showToast} = useToast();

    const [character, setCharacter] = useState<CharacterProps | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState<{ id: number; title: string }[]>([]);
    const [mensaje, setMensaje] = useState("");
    const [creando, setCreando] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [nuevoTitulo, setNuevoTitulo] = useState("");
    const [rating, setRating] = useState<{ id: number; rate: number; } | null>(null)
    
    useEffect(() =>{
        CharactersService.getCharacterById(id!)
        .then(setCharacter)
        .catch(() => showToast("Error al cargar el personaje", 'error'))
    }, [id]);

    useEffect(() => {
        if(!AuthService.isAuthenthicated()) return;
        RatingService.getCharacterById(id!)
        .then(setRating)
        .catch(() => showToast("Error al cargar la valoración", 'error'))
    }, [id])

    if(!character) return <div>Loading ....</div>

    const openModal = async () => {
        try{
            const data = await ListService.getMyLists();
            setLists(Array.isArray(data) ? data: [])
            setShowModal(true)
        }catch(error: any){
            if(error.message === "No estas registrado") navigate('/login')
        }
    };

    const addToList = async (listId: number) => {
        
    const data = await ListService.addCharacter(
        listId, id!, character!.name, character!.house, character!.image, character!.spells
    );
    setMensaje(data.message || data.error);
    setTimeout(() => {
      setShowModal(false);
      setMensaje("");
    }, 1500);
  };

  const createList = async () => {
    if (!nuevoTitulo.trim()) return;
    const nueva = await ListService.createList(nuevoTitulo, "", isPublic);
    setLists([...lists, nueva]);
    setCreando(false);
    setNuevoTitulo("");
    setIsPublic(true)
  };

const handleRate = async (puntuacion: number) => {
   const data = await RatingService.rate(
        id!, character!.name, character!.house, character!.image, puntuacion
    );
    setRating(data);
}

    return(
        <div className="flex flex-col min-h-screen mx-6 bg-base-100">
            <ToastComponent toasts={toasts} />
            <NavBar />
            <div className="flex-1 mb-16 mt-8">
                <h1 className="text-4xl font-bold text-center mb-4">{character.name}</h1>
               {character.alternate_names && character.alternate_names.length > 0 && (
                    <h2 className="text-lg text-secondary text-center mb-3">
                        {character.alternate_names.join(", ")}
                    </h2>
                )}
                <div className="flex justify-center">
                    <div className="grid lg:grid-cols-2 md:w-2/3 mt-5 p-5 border-2 border-base-300 rounded-lg">
                        <div className="p-3 flex flex-col items-center justify-center">
                            <img className="w-72 h-96 object-cover rounded-lg" src={character.image || '../../images/image_not_provided.png'} alt={character.name} />
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
                            <div className="flex flex-col gap-3 mt-6">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} onClick={() => handleRate(n)} className="text-2xl">
                                        {n <= (rating?.rate ?? 0) ? "★" : "☆"}
                                    </button>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mt-6 mb-3">Hechizos</h3>
                            <ul className="list-disc pl-5">
                            {character.spells?.map((spell, index) => (
                                <li key={index} className="mb-1">
                                <span className="font-semibold">{spell.name}</span> — {spell.description}
                                </li>
                            ))}
                            </ul>
                            <div className="flex justify-end mt-6">
                                <button onClick={openModal} className="btn btn-primary w-36 text-center">
                                    Add
                                </button>
                            </div>
                
                        </div>
                    </div>
                </div>
                {showModal && (
            <div className="fixed inset-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 w-80">
                <h3 className="text-lg font-bold mb-4">Añadir a una lista</h3>

                {mensaje ? (
                <p className="text-center text-success font-semibold">{mensaje}</p>
                ) : creando ? (
                <div className="flex flex-col gap-2">
                    <input
                    type="text"
                    placeholder="Nombre de la lista"
                    value={nuevoTitulo}
                    onChange={e => setNuevoTitulo(e.target.value)}
                    className="border border-base-300 bg-base-100 text-base-content rounded px-3 py-2 w-full"
                    />
                    <label className="label cursor-pointer justify-between px-1">
                        <span className="label-text text-sm">Visibilidad</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/70">Privada</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm"
                                checked={isPublic}
                                onChange={e => setIsPublic(e.target.checked)}
                            />
                            <span className="text-xs text-base-content/70">Pública</span>
                        </div>
                    </label>
                    <button onClick={createList} className="btn btn-primary w-full">
                    Crear
                    </button>
                    <button onClick={() => setCreando(false)} className="text-sm text-base-content/80">
                    Volver
                    </button>
                </div>
                ) : lists.length === 0 ? (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-base-content/80">No tienes listas creadas.</p>
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
                            className="w-full text-left px-4 py-2 rounded hover:bg-base-200 border border-base-300"
                        >
                            {list.title}
                        </button>
                        </li>
                    ))}
                    </ul>
                    <button
                    onClick={() => setCreando(true)}
                    className="mt-3 text-sm text-base-content/70 hover:underline w-full text-center"
                    >
                    + Crear nueva lista
                    </button>
                </>
                )}

                <button
                onClick={() => { setShowModal(false); setCreando(false); setMensaje(""); }}
                className="mt-4 text-sm text-base-content/80 hover:text-accent w-full text-center"
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