import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import Profile from "./pages/profile.jsx";
import ProductDetail from "./pages/productDetail.jsx";
import Product from "./pages/product.jsx";
import MainLayout from "./components/layouts/MainLayout.jsx";
import PlaceOrder from "./pages/placeOrder.jsx";
import AuthenticationLayout from "./components/layouts/AuthenticationLayout.jsx";
import VendorRoute from "./components/routes/VendorRoute.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/product/:slug",
        element: <Product />
      },
      {
        path: "/profile",
        element:(
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "/product/detail/:slug",
        element: (
          <VendorRoute>
            <ProductDetail />
          </VendorRoute>
        )
      },
      {
        path: "/orders/new",
        element: (
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    element: <AuthenticationLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
