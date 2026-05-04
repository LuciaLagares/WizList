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
    <span className="loading loading-spinner loading-xl"></span>

    )
}
export default Details;