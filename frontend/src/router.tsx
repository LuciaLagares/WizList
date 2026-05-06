import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Detail from "./components/detailComponent"
import App from "./App";
import Registrer from "./components/registerComponent";
import Login from "./components/loginComponent";
import Perfil from "./components/perfilComponent";
import Home from "./components/homeComponent";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: "/api/characters",
    element: <App/>,
  },
  {
    path: "/detail/:id",
    element: <Detail />,
  },
  {
    path: "/register", 
    element: <Registrer />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/perfil',
    element: <Perfil />
  },
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;