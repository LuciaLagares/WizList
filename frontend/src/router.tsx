import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Detail from "./components/detailComponent"
import App from "./App";
import Registrer from "./components/registerComponent";
import Login from "./components/loginComponent";

const router = createBrowserRouter([
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
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;