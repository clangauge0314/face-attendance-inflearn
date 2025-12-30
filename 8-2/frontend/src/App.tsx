import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/common/layout";
import { ProtectedRoute } from "./components/common/protected-route";
import { PublicRoute } from "./components/common/public-route";

import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import { AdminLoginPage } from "./pages/admin-login-page";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminFaceSetupPage } from "./pages/admin-face-setup-page";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin/login",
        element: (
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
      path: "admin/face-setup",
        element: (
          <ProtectedRoute>
            <AdminFaceSetupPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
