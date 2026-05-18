import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CharacterProps } from "./cardComponent";
import NavBar from "./navBarComponent";



function Details(){
    const {id} = useParams();
    const [character, setCharacter] = useState<CharacterProps | null>(null);
     useEffect(() =>{
        fetch(`http://localhost:5000/character/${id}/spells`)
        .then(res => res.json())
        .then(data => setCharacter(data));
     }, [id]);
     if(!character) return <div>Loading ....</div>
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
            
            
            </div>
            
        </div>
    )
}
export default Details;