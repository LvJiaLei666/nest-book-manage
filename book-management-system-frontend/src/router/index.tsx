import {createBrowserRouter, Navigate} from "react-router-dom";
import {Login} from "../Login";
import {Register} from "../Register";
import {BookManage} from "../BookManage";
import {SliceUpload} from "../SliceUpload/SliceUpload.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/books" replace/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/books",
    element: <BookManage/>,
  },
  {
    path: "/sliceUpload",
    element: <SliceUpload/>
  }
]);

export default router;
