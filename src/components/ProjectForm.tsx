import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectAPI from "../api/ProjectAPI";
import { Project } from "../models/Project";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      const project = ProjectAPI.getProject(id);
      if (project) {
        setName(project.name);
        setDescription(project.description);
      }
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newProject: Project = {
      name,
      description,
    };

    if (id) {
      ProjectAPI.updateProject(newProject);
    } else {
      ProjectAPI.createProject(newProject);
    }
  };

  const handleCancel = () => {};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        "& .MuiButton-root": { m: 1 },
        p: 2,
        border: "1px solid ",
        borderRadius: "8px",
        backgroundColor: "background.paper",
        width: "40%",
        margin: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom color="textPrimary">
        Add your project
      </Typography>
      <div>
        <TextField
          label="Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Description"
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />
      </div>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;
