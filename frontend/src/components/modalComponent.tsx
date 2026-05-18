import { Link } from "react-router-dom";
import { useState } from "react";

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
  const [showModal, setShowModal] = useState(false);
  const [lists, setLists] = useState<{ id: number; title: string }[]>([]);
  const [mensaje, setMensaje] = useState("");

  const openModal = async () => {
    const res = await fetch("http://localhost:5000/my-lists", {
      credentials: "include",
    });
    const data = await res.json();
    setLists(data);
    setShowModal(true);
  };

  const addToList = async (listId: number) => {
    const res = await fetch(`http://localhost:5000/list/${listId}/add-character`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        character_id: id,
        character_name: name,
        character_house: house,
        character_image: image,
        spells: spells,
      }),
    });

    const data = await res.json();
    setMensaje(data.message || data.error);
    setTimeout(() => {
      setShowModal(false);
      setMensaje("");
    }, 1500);
  };

  return (
    <>
      <div className="card card-side bg-indigo-600 shadow-sm h-48">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Añadir a una lista</h3>

            {mensaje ? (
              <p className="text-center text-green-600 font-semibold">{mensaje}</p>
            ) : lists.length === 0 ? (
              <p className="text-gray-500">No tienes listas creadas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {lists.map((list) => (
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
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 w-full text-center"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;