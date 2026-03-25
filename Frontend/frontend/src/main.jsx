import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { RouterProvider,createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import Channel from "./pages/Channel.jsx";


import AuthLayout from "./components/AuthLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children : [
      {
          path: "/",
          element: <Home />
      },
      {
        path : "/login",
        element: (
          <AuthLayout authentication = {false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication = {false}>
            <Signup />
          </AuthLayout>
        )
      },
      {
        path: "/video/:videoId",
        element: <VideoPage/>
      },
      {
        path: "/upload",
        element: (
          <AuthLayout authentication = {true}>
            <UploadVideo />
          </AuthLayout>
        )
      },
      {
        path: "/channel/:username",
        element: <Channel />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
      <Provider store={store}>
        <RouterProvider router = {router} />
      </Provider>
  </StrictMode>
);