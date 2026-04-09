import {  useParams } from "react-router-dom";
import type { Character } from "../App"
import { useEffect, useState } from "react";



function Details(){
    const {id} = useParams();
    const [character, setCharacter] = useState<Character | null>(null);
     useEffect(() =>{
        fetch(`http://localhost:5000/detail/${id}`)
        .then(res => res.json())
        .then(data => setCharacter(data[0]));
     }, [id]);
     if(!character) return <div>Loading ....</div>
    return(
        <>
            <h1>{character.name}</h1>
            
            <p><b>Alternative names: </b></p>
            <ul>
                {character.alternate_names.length > 0 ? character.alternate_names.map(c => <li>{c}</li>)
                : <li>No alternate names</li>
                }
            </ul>
        </>

    )
}
export default Details;