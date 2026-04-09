import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Detail from "./components/detailComponent"
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/api/characters",
    element: <App/>,
  },
  {
    path: "/detail/:id",
    element: <Detail />,
  },
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;