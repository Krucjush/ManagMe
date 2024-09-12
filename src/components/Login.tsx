import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import userService from "../services/UserService";

function Login() {
  const [credentials, setCredentials] = useState({
    login: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await userService.login(credentials);
    if (success) {
      login();
      navigate("/projectlist");
    } else {
      console.error("Login failed");
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    const success = await userService.googleLogin(response.credential);
    if (success) {
      login();
      navigate("/projectlist");
    } else {
      console.error("Google Login failed");
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google Login failed");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          p: 4,
          border: "1px solid ",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <Typography gutterBottom align="center">
          User Login
        </Typography>
        <TextField
          label="Login"
          variant="standard"
          value={credentials.login}
          onChange={(e) =>
            setCredentials({ ...credentials, login: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 2, width: "100%" }}
        >
          Login
        </Button>
        <Button
          variant="text"
          onClick={() => navigate("/registration")}
          sx={{ mt: 2, width: "100%" }}
        >
          Don't have an account? Register here
        </Button>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          size="large"
        />
      </Box>
    </Box>
  );
}

export default Login;
