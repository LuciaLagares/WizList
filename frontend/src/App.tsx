import { useEffect, useState } from "react"
import Card from "./components/cardComponent";
import NavBar from "./components/navBarComponent";


function App() {
const [characters, setCharacters] = useState([]);
  useEffect(() =>{
    fetch('http://localhost:5000/show-characters')
    .then(res => res.json())
    .then(data => setCharacters(data));
  }, []);

  return (

    <div className="bg-blue-850">
      <NavBar />
      <div className="grid grid-cols-3 gap-6 p-4">
          {characters.map((character: any) => (
            <div key={character.id}>
              <Card {...character} />
            </div>
          ))}
      </div>
      
    </div>
  )
}


export default App
