import { useEffect, useState } from "react"
import Card from "./components/cardComponent";

export interface Character {
  id: number
  name: string
  house: string
  image: string
  alternate_names: []
}

function App() {
const [datos, setDatos] = useState<Character[]>([]);
  useEffect(() =>{
    fetch('http://localhost:5000/api/characters')
    .then(res => res.json())
    .then(data => { setDatos(data)})
  }, []);

  return <div className="grid grid-cols-8 gap-2 p-4">
      {datos.map(character => (
        <div>

          <Card key={character.id} character={character} />
        </div>
      ))}
    </div>
}


export default App
