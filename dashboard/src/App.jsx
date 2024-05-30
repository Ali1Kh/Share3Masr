import { RouterProvider, createHashRouter } from "react-router-dom";
import Login from "./Components/Login/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Components/Dashboard/Dashboard";
import Categories from "./Components/Categories/Categories";
import Resturants from "./Components/Resturants/Resturants";
import Products from "./Components/Products/Products";
import Areas from "./Components/Areas/Areas";
import Delivery from "./Components/Delivery/Delivery";
import Orders from "./Components/Orders/Orders";
const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: (
          <>
            <Categories />
          </>
        ),
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "resturants",
        element: <Resturants />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "areas",
        element: <Areas />,
      },
      {
        path: "delivery",
        element: <Delivery />,
      },
      {
        path: "orders",
        element: <Orders />,
      },

      {
        path: "*",
        element: <h5>Page Not Found !</h5>,
      },
    ],
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
