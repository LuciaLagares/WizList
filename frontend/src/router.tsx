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
import DetailList from "./components/personalListComponent";
import PublicLists from "./components/publicListComponent";
import PersonProfile from "./components/personProfileComponent";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: "/show-characters",
    element: <App/>,
  },
  {
    path: "/character/:id/spells",
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
  {
    path: '/list/:id',
    element: <DetailList />
  },
  {
    path: '/public-lists',
    element:<PublicLists />
  },
  {
    path: '/:id/perfil',
    element: <PersonProfile />
  },
  
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;