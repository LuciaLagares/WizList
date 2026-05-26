import { useEffect, useState } from "react"
import Card from "./components/cardComponent";
import NavBar from "./components/navBarComponent";


function App() {
const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() =>{
    fetch(`http://localhost:5000/show-characters?page=${currentPage}&per_page=6`)
    .then(res => res.json())
    .then(data => {
      setCharacters(data.characters); 
      setTotalPages(data.pages)
    });

  }, [currentPage]);

    return (
    <div className="min-h-screen pb-16">
      <NavBar />
      <div className="divider m-6"></div>

      
        <div className="grid grid-cols-3 gap-6 p-4">
          {characters.map((character: any) => (
            <div key={character.id}>
              <Card {...character} />
            </div>
          ))}
        </div>


      <div className="flex justify-center items-center gap-4 py-6">
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}


export default App
