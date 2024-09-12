import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import userService from "../services/UserService";
import { User } from "../models/User";

const roles: User["role"][] = ["admin", "devops", "developer"];

function Registration() {
  const [user, setUser] = useState<
    Omit<User, "role"> & { role: User["role"] | "" }
  >({
    id: Date.now().toString(),
    login: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (user.role === "") {
      alert("Please select a role");
      return;
    }

    const newUser: User = { ...user, role: user.role as User["role"] };
    const success = await userService.register(newUser);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          p: 4,
          border: "1px solid grey",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          User Registration
        </Typography>
        <TextField
          label="Login"
          variant="standard"
          value={user.login}
          onChange={(e) => setUser({ ...user, login: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="First Name"
          variant="standard"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          variant="standard"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Role"
          variant="standard"
          value={user.role}
          onChange={(e) =>
            setUser({ ...user, role: e.target.value as User["role"] })
          }
          fullWidth
          margin="normal"
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          sx={{ mt: 2, width: "100%" }}
        >
          Register
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/login")}
          sx={{ mt: 2, width: "100%" }}
        >
          Already have an account? Login here
        </Button>
      </Box>
    </Box>
  );
}

export default Registration;
