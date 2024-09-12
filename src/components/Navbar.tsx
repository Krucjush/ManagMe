import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import userService from "../services/UserService";
import NightModeToggle from "./NightModeToggle";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    userService.logout();
    navigate("/");
  };

  const isLoggedIn = userService.getCurrentUser() !== null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <nav className="navbar">
        <img src="/src/assets/logo.png" alt="Logo" className="navbar-logo" />
        <span className="gwendolyn-bold">ManagMe</span>
        <ul className="navbar-ul">
          <li>
            <Link className="navbar-link-text" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="navbar-link-text" to="/projects">
              Add Project
            </Link>
          </li>
          <li>
            <Link className="navbar-link-text" to="/projectlist">
              List of Projects
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link
                onClick={handleLogout}
                className="navbar-link-text"
                color="red"
                to="/home"
              >
                Logout
              </Link>
            </li>
          )}
          <li>
            <NightModeToggle />
          </li>
        </ul>
      </nav>
    </Box>
  );
};

export default Navbar;
