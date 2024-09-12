import React from "react";
import { Box,  CssBaseline } from "@mui/material";


const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <img
          className="logo"
          src="./src/assets/logo.png"
          alt="Centered Image"
          style={{ maxWidth: "50%", maxHeight: "50%" }}
        />
      </Box>
      <h1>Home</h1>

      <CssBaseline />
    </Box>
  );
};

export default Home;
