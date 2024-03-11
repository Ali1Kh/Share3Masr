import { RouterProvider, createHashRouter } from "react-router-dom";
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Components/Dashboard/Dashboard";
const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </>
  );
}

export default App;
