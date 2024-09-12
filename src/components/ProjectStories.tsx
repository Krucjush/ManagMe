import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useParams, Link, Routes, Route } from "react-router-dom";
import StoryService from "../services/StoryService";
import projectService from "../services/ProjectService";
import { Story } from "../models/Story";
import { Project } from "../models/Project";
import StoryTasks from "./StoryTasks";

function ProjectStories() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState<Partial<Story>>({
    name: "",
    description: "",
    priority: "low",
    status: "todo",
    projectId: projectId!,
    ownerId: "",
  });

  useEffect(() => {
    async function fetchData() {
      if (projectId) {
        const project = await projectService.getProject(projectId);
        setProject(project);
        const stories = await StoryService.getStoriesByProjectId(projectId);
        setStories(stories);
      }
    }
    fetchData();
  }, [projectId]);

  const handleAddStory = async () => {
    if (!projectId) return;
    const storyToCreate = {
      ...newStory,
      projectId,
      createdAt: new Date().toISOString(),
    } as Story;
    await StoryService.createStory(storyToCreate, projectId);
    const updatedStories = await StoryService.getStoriesByProjectId(projectId);
    setStories(updatedStories);
    setNewStory({ name: "", description: "", priority: "low", status: "todo" });
  };

  const handleDeleteStory = async (storyId: string) => {
    console.log(storyId, "handledelete");
    await StoryService.deleteStory(storyId);
    if (!projectId) return;
    const updatedStories = await StoryService.getStoriesByProjectId(projectId);
    setStories(updatedStories);
  };
  const handleEditStory = (story: Story) => {
    setNewStory(story);
  };

  const handleUpdateStory = async (story: Story) => {
    await StoryService.updateStory(story as Story);
    if (!projectId) return;
    const updatedStories = await StoryService.getStoriesByProjectId(projectId);
    setStories(updatedStories);
    setNewStory({
      name: "",
      description: "",
      priority: "low",
      status: "todo",
      projectId,
    });
    await StoryService.updateStory(story as Story);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        p: 2,
        border: "1px solid grey",
        borderRadius: "8px",
        m: 2,
        width: "70%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {project?.name} Stories
      </Typography>
      <List>
        {stories.map((story) => (
          <ListItem
            key={story._id}
            divider
            sx={{ borderRadius: "4px", mb: 1 }}
            component={Link}
            to={`/projects/${projectId}/stories/${story._id}/tasks`}
          >
            <ListItemText
              primary={`${story.name} - ${story.status}`}
              secondary={story.description}
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.preventDefault();
                handleEditStory(story);
              }}
              sx={{ color: "text.primary" }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteStory(story._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          {newStory._id ? "Edit Story" : "Add Story"}
        </Typography>
        <TextField
          label="Name"
          variant="standard"
          value={newStory.name}
          onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          variant="standard"
          value={newStory.description}
          onChange={(e) =>
            setNewStory({ ...newStory, description: e.target.value })
          }
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          select
          label="Priority"
          variant="standard"
          value={newStory.priority}
          onChange={(e) =>
            setNewStory({
              ...newStory,
              priority: e.target.value as "low" | "medium" | "high",
            })
          }
          fullWidth
          margin="normal"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          variant="standard"
          value={newStory.status}
          onChange={(e) =>
            setNewStory({
              ...newStory,
              status: e.target.value as "todo" | "doing" | "done",
            })
          }
          fullWidth
          margin="normal"
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        {newStory._id ? (
          <Button
            variant="contained"
            onClick={() => handleUpdateStory(newStory as Story)}
            sx={{ mt: 2 }}
          >
            Update Story
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStory}
            sx={{ mt: 2 }}
          >
            Add Story
          </Button>
        )}
      </Box>
      <Routes>
        <Route path="stories/:storyId/tasks" element={<StoryTasks />} />
      </Routes>
    </Box>
  );
}

export default ProjectStories;
