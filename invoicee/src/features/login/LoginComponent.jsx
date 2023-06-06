import React, { useEffect, useState } from "react";
import { CLIENT_ID, API_KEY } from "../../helpers/constants";
import useAuth from "./useAuth";
import { Box, Button } from "@mui/material";

const LoginComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { login } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={() => login()}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginComponent;
