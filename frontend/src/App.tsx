import { useEffect, useState } from "react"
import Title from "./components/titleComponent";
import Card, { type CharacterProps } from "./components/cardComponent";


function App() {
const [characters, setCharacters] = useState([]);
  useEffect(() =>{
    fetch('http://localhost:5000/api/characters')
    .then(res => res.json())
    .then(data => setCharacters(data));
  }, []);

  return (

    <div className="bg-blue-850">
      <Title />
      <div className="grid grid-cols-3 gap-6 p-4">
          {characters.map((character: any) => (
            <div>
              <Card key={character.id} character={character} />
            </div>
          ))}
      </div>
      
    </div>
  )
}


export default App
