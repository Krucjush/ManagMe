import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import ProjectStories from "./components/ProjectStories";
import Registration from "./components/Registration";
import Login from "./components/Login";
import StoryTasks from "./components/StoryTasks";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeContext } from "./theme/ThemeContextProvider";

const App: React.FC = () => {
  const clientId =
    "936497644519-ioeh6h6judir9v0j6lsf3ctaibuvutmm.apps.googleusercontent.com";
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <RootLayout />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projectlist"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectStories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId/stories/:storyId/tasks"
              element={
                <ProtectedRoute>
                  <StoryTasks />
                </ProtectedRoute>
              }
            />

            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
