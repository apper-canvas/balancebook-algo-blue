import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/index";
import React from "react";
// App.jsx is no longer needed as RouterProvider is now in main.jsx
// This file is kept for potential future app-level configurations
function App() {
  return (
    <>
      <RouterProvider router={router} />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;