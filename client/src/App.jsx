import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import PropertyImagesPage from "./routes/newPostPage/propertyImagesPage";
import AboutPage from "./routes/aboutPage/aboutPage";
import ContactPage from "./routes/contactPage/contactPage";
import PropertiesPage from "./routes/propertiesPage/propertiesPage";
import ForgotPassword from "./routes/forgotPassword/forgotPassword";
import ResetPassword from "./routes/resetPassword/resetPassword";
import ModelViewerPage from "./routes/modelViewerPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/properties",
          element: <PropertiesPage />,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
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
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/3d-view/:id?",
      element: <ModelViewerPage />,
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: currentUser?.userType === "seller" ? <NewPostPage /> : <Navigate to="/" />,
        },
        {
          path: "/add/images",
          element: currentUser?.userType === "seller" ? <PropertyImagesPage /> : <Navigate to="/" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
