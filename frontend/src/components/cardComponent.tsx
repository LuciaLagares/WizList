import { Link } from "react-router-dom";

export interface CharacterProps {
  id: string;
  name: string;
  house: string;
  image: string;
  alternate_names?: string[];
  spells: { name: string; description: string }[];
}

function Card({ id, name, house, image }: CharacterProps) {
  

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <Link to={`/character/${id}/spells`}>
        <figure>
          <img
            className="w-full h-36 sm:h-48 object-cover rounded-t-2xl"
            src={image || "../../images/image_not_provided.png"}
            alt={name}
          />
        </figure>
      </Link>
      <div className="card-body p-3">
        <h2 className="card-title text-sm line-clamp-1">{name}</h2>
        <p className="text-xs text-base-content/70">{house}</p>
      </div>
    </div>
  );
}

export default Card;