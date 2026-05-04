import { Link } from "react-router-dom";


function Card(){

    return(
         <div className="card card-side bg-indigo-600 shadow-sm h-48">
        <Link to={`/detail/${character.id}`}>
            <figure className="h-full w-40">
                <img className="w-full h-full object-cover rounded-lg"
                src= {character.attributes.image || '../../images/image_not_provided.png'} 
                alt= {character.attributes.slug} />
            </figure>
        </Link>
        
        <div className="card-body">
            <h2 className="card-title">{character.attributes.slug}</h2>
            <p>Click the button to add it to the list</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary p-5">Add</button>
            </div>
        </div>
    </div>
    );
}
export default Card;
