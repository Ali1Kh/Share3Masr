import { RouterProvider, createHashRouter } from "react-router-dom";
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";
const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
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
