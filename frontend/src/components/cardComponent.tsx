import { Link } from "react-router-dom";
import type { Character } from "../App"

interface Props {
    character: Character
}

function Card({character}: Props){

    return(
        <>
        <Link to={`/detail/${character.id}`}>
            <div className="w-[100px] h-[100px] overflow-hidden rounded">
                <img className="w-full h-full object-cover object-top" src={character.image || 'https://scbaking.com/global/assets/images/unavailable.png'} alt={character.name}/>
            </div>
        </Link>
            <div>{character.name}</div>
        </>
    )
}
export default Card;
