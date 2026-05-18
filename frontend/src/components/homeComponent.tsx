import { Link } from "react-router-dom"

function Home(){
    return(
        <div className="h-screen w-full flex flex-col overflow-hidden">
    <div 
        className="flex-1 w-full bg-cover bg-center flex flex-col items-center justify-center gap-5" 
        style={{ backgroundImage: "url('../../images/home.png')" }}
    >           
        <h1 className="text-white text-6xl font-bold drop-shadow-2xl text-center">
            Bienvenido a WizList
        </h1>

        <Link to={'/login'} className="btn btn-primary text-white">
            Accede a tu cuenta!
        </Link>
    </div>
</div>
    )
}

export default Home