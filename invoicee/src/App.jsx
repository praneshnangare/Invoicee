import React, { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Routes from "./routes/Routes";

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(Routes()), {
    basename: "",
  });
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
