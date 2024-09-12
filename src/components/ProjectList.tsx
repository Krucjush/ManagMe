import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Project } from "../models/Project";
import projectService from "../services/ProjectService";

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectOwnerId, setNewProjectOwnerId] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);
    };

    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description);
  };

  const handleDelete = async (_id: string | undefined) => {
    if (!_id) {
      console.error("Attempted to view a project without an ID");
      return;
    }
    await projectService.deleteProject(_id);
    const updatedProjects = await projectService.getProjects();
    setProjects(updatedProjects);
  };

  const handleSave = async () => {
    if (editingProject) {
      const updatedProject = {
        ...editingProject,
        name: newProjectName,
        description: newProjectDescription,
        ownerId: Number(newProjectOwnerId),
      };
      await projectService.updateProject(updatedProject);
    } else {
      const newProject = {
        name: newProjectName,
        description: newProjectDescription,
      };

      await projectService.createProject(newProject);
    }
    const updatedProjects = await projectService.getProjects();
    setEditingProject(null);
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectOwnerId(0);
    setProjects(updatedProjects);
  };

  const handleViewProject = (_id: string | undefined) => {
    if (!_id) {
      console.error("Attempted to view a project without an ID");
      return;
    }
    projectService.setCurrentProject(_id);
    navigate(`/projects/${_id}`);
  };

  return (
    <Box
      component="div"
      sx={{
        bgcolor: "background.paper",
        p: 2,
        border: "1px solid black",
        borderRadius: "8px",
        m: 2,
        width: "70%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Project List
      </Typography>
      <List>
        {projects.map((project, index) => (
          <ListItem
            key={project._id}
            divider
            sx={{
              borderRadius: "4px",
              mb: 1,
              border: index !== projects.length ? "1px solid black" : "none",
            }}
          >
            <ListItemText
              primary={project.name}
              secondary={project.description}
              onClick={() => handleViewProject(project._id)}
            />
            <IconButton edge="end" onClick={() => handleEdit(project)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" onClick={() => handleDelete(project._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          {editingProject ? "Edit Project" : "New Project"}
        </Typography>
        <TextField
          label="Name"
          variant="standard"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          variant="standard"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          {editingProject ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProjectList;
