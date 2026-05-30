import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Detail from "./components/detailComponent"
import App from "./App";
import Registrer from "./components/registerComponent";
import Login from "./components/loginComponent";
import Profile from "./components/profileComponent";
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
    path: '/profile',
    element: <Profile />
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
    path: '/:id/profile',
    element: <PersonProfile />
  },
  
]);

function AppRouter(){
    return <RouterProvider router={router} />
}
export default AppRouter;