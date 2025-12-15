import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/common/layout";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;