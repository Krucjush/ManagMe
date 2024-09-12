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
import { useParams } from "react-router-dom";
import taskService from "../services/TaskService";
import userService from "../services/UserService";
import { Task } from "../models/Task";
import { User } from "../models/User";

const StoryTasks = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { projectId } = useParams<{ projectId: string }>();

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    description: "",
    priority: "low",
    status: "todo",
    storyId: storyId,
    estimatedTime: 0,
    assignedUser: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (storyId) {
          const fetchedTasks = await taskService.getTasksByStoryId(storyId);

          setTasks(fetchedTasks);
          const fetchedUsers = await userService.getUsers();
          console.log(fetchedUsers);
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error fetching tasks or users", error);
      }
    };

    fetchData();
  }, [storyId]);

  const handleAddTask = async () => {
    try {
      await taskService.addTask(
        newTask as Task,
        storyId as string,
        projectId as string
      );
      if (storyId) {
        setTasks(await taskService.getTasksByStoryId(storyId));

        setNewTask({
          name: "",
          description: "",
          priority: "low",
          status: "todo",
          estimatedTime: 0,
          assignedUser: "",
        });
      }
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (storyId) {
        await taskService.deleteTask(taskId);
        const updatedTasks = await taskService.getTasksByStoryId(storyId);
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };
  const handleEditTask = (task: Task) => {
    setNewTask(task);
  };
  const handleUpdateTask = async (task: Task) => {
    if (!newTask._id) return;
    try {
      if (storyId) {
        setTasks(await taskService.getTasksByStoryId(storyId));
      }
      setNewTask({
        name: "",
        description: "",
        priority: "low",
        status: "todo",
        estimatedTime: 0,
        assignedUser: "",
      });
      await taskService.updateTask(task as Task);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: "8px",
        m: 2,
        width: "70%",
        margin: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Story Tasks
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            divider
            sx={{ bgcolor: "background.paper", borderRadius: "4px", mb: 1 }}
          >
            <ListItemText
              primary={`${task.name} - ${task.status}`}
              secondary={task.description}
            />
            <IconButton
              edge="end"
              onClick={(e) => {
                e.preventDefault();
                handleEditTask(task);
              }}
              sx={{ color: "text.primary" }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteTask(task._id);
                console.log(task._id, "component");
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <TextField
        label="Name"
        variant="standard"
        fullWidth
        margin="normal"
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
      />
      <TextField
        label="Description"
        variant="standard"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
      />
      <TextField
        select
        label="Assigned User"
        variant="standard"
        fullWidth
        margin="normal"
        value={newTask.assignedUser || ""}
        onChange={(e) =>
          setNewTask({ ...newTask, assignedUser: e.target.value })
        }
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.firstName + user.lastName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Priority"
        variant="standard"
        fullWidth
        margin="normal"
        value={newTask.priority}
        onChange={(e) =>
          setNewTask({
            ...newTask,
            priority: e.target.value as "low" | "medium" | "high",
          })
        }
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </TextField>
      <TextField
        label="Estimated Time (hours)"
        variant="standard"
        type="number"
        fullWidth
        margin="normal"
        value={newTask.estimatedTime}
        onChange={(e) =>
          setNewTask({ ...newTask, estimatedTime: Number(e.target.value) })
        }
      />
      <TextField
        select
        label="Status"
        variant="standard"
        fullWidth
        margin="normal"
        value={newTask.status}
        onChange={(e) =>
          setNewTask({
            ...newTask,
            status: e.target.value as "todo" | "doing" | "done",
          })
        }
      >
        <MenuItem value="todo">To Do</MenuItem>
        <MenuItem value="doing">Doing</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </TextField>
      {newTask._id ? (
        <Button
          variant="contained"
          onClick={() => handleUpdateTask(newTask as Task)}
          sx={{ mt: 2 }}
        >
          Update Story
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      )}
    </Box>
  );
};

export default StoryTasks;
