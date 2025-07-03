import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../Login";
import { Register } from "../Register";
import { BookManage } from "../BookManage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/books" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/books",
    element: <BookManage />,
  },
]);

export default router;
