import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Detail from "./components/detailComponent"
import App from "./App";
import Registrer from "./components/registerComponent";

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
  }
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;