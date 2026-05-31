import { useEffect, useState } from "react"
import Card from "./components/cardComponent";
import NavBar from "./components/navBarComponent";
import { CharactersService } from "./services/charactersService";


function App() {
const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("")

  useEffect(() =>{
    CharactersService.getAllCharacters(currentPage, 6, search)
    .then(data => {
      setCharacters(data.characters); 
      setTotalPages(data.pages)
    });

  }, [currentPage, search]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
    return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="divider "></div>

       <div className="flex justify-center px-4 mb-4">
        <input
          type="text"
          placeholder="Buscar personaje"
          value={search}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-md"
        />
      </div>
      
        <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-8 px-4 max-w-4xl mx-auto w-full content-start">
          {characters.map((character: any) => (
            <div key={character.id} className="border border-base-300 rounded-xl p-2 ">
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
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}


export default App
