import { Link } from "react-router-dom";

export interface CharacterProps {
  id: string;
  name: string;
  house: string;
  image: string;
  alternate_names: string[];
  spells: { name: string; description: string }[];
}

function Card({ id, name, house, image }: CharacterProps) {
  

  return (
    <>
      <div className="card card-side bg-base-100 shadow-sm h-48 border-accent">
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
        </div>
      </div>

    </>
  );
}

export default Card;