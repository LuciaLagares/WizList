import { useEffect, useState } from "react"
import Card from "./components/cardComponent";
import Title from "./components/titleComponent";


function App() {
const [datos, setDatos] = useState();
  useEffect(() =>{
    fetch('http://localhost:5000/api/characters')
    .then(res => res.json())
  }, []);

  return (

    <div className="bg-blue-850">
  <Title />
  <div className="grid grid-cols-3 gap-6 p-4">
      {datos.map(character => (
        <div>
          <Card key={character.id} character={character} />
        </div>
      ))}
    </div>
  </div>
  )
}


export default App
