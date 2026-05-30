import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../hooks/useToast";
import { ListService } from "../services/listService";
import ToastComponent from "./toastComponent";

export interface SpellProps {
  id: string;
  name: string;
  description: string;
}

export interface CharacterProps {
  id: string;
  name: string;
  house: string;
  image: string;
  alternate_names: string[];
  spells: SpellProps[];
}

function Card({ id, name, house, image, spells }: CharacterProps) {
  const { toasts, showToast } = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [lists, setLists] = useState<{ id: number; title: string }[]>([]);
  const [mensaje, setMensaje] = useState("");

  const openModal = async () => {
    try {
        const data = await ListService.getMyLists();
        setLists(Array.isArray(data) ? data : []);
        setShowModal(true);
    } catch {
        showToast("Error al cargar tus listas", 'error');
    }
  };

  const addToList = async (listId: number) => {
    try {
        const data = await ListService.addCharacter(listId, id, name, house, image, spells);
        setMensaje(data.message || data.error);
        setTimeout(() => {
            setShowModal(false);
            setMensaje("");
        }, 1500);
    } catch {
        showToast("Error al añadir el personaje a la lista", 'error');
    }
  };

  return (
    <>
    <ToastComponent toasts={toasts} />
      <div className="card card-side bg-secondary shadow-sm h-48">
        <Link to={`/character/${id}/spells`}>
          <figure className="h-full w-40">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={image || "../../images/image_not_provided.png"}
              alt={name}
            />
          </figure>
        </Link>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>{house}</p>
          <div className="card-actions justify-end">
            <button onClick={openModal} className="btn btn-primary p-5">
              Add
            </button>
          </div>
        </div>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Añadir a una lista</h3>

            {mensaje ? (
              <p className="text-center text-success font-semibold">{mensaje}</p>
            ) : lists.length === 0 ? (
              <p className="text-base-content/80">No tienes listas creadas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {lists.map((list) => (
                  <li key={list.id}>
                    <button
                      onClick={() => addToList(list.id)}
                      className="w-full text-left px-4 py-2 rounded hover:bg-accent border border-base-300"
                    >
                      {list.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-base-content/80 hover:text-accent w-full text-center"
            >
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;