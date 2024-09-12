import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import mongoose, { ConnectOptions } from "mongoose";
interface GenericError {
  message: string;
}
const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const client = new OAuth2Client(googleClientId);
mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



app.use(cors());
app.use(express.json());

/**
 * Generates a JWT token with the provided payload and expiration.
 * @param {JwtPayload & { id: string, role: string, firstName: string, lastName: string }} payload - The payload for the JWT token.
 * @param {number} expirationInSeconds - The duration in seconds until the token expires.
 * @returns {string} - The generated JWT token.
 */
const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  firstName: String,
  lastName: String,
  role: { type: String, default: "developer" },
});

const User = mongoose.model("User", userSchema);
function generateToken(
  payload: JwtPayload & {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
  },
  expirationInSeconds: number
): string {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ ...payload, exp }, tokenSecret, {
    algorithm: "HS256",
  });
  return token;
}

app.post("/register", async (req: Request, res: Response) => {
  const { login, password, firstName, lastName, role } = req.body;
  const existingUser = await User.findOne({ login });

  const newUser = new User({ login, password, firstName, lastName, role });
  if (existingUser?.login === login) {
    return res.status(400).send("User already exists");
  } else await newUser.save();
  res.status(201).send("User registered");
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});
app.post("/login", async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login, password });
  if (!user) {
    return res.status(401).send("Invalid login or password");
  }
  if (!user.firstName || !user.lastName) {
    return res.status(400).send("Required user information is incomplete.");
  }
  const token = generateToken(
    {
      id: user.id.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    60 * 15
  );
  const refreshToken = generateToken(
    {
      id: user.id.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    60 * 60 * 24
  );
  res.status(200).send({ token, refreshToken, user });
});
app.post("/google-login", async (req: Request, res: Response) => {
  const { token: googleToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send("Invalid Google token");
    }

    let user = await User.findOne({ login: payload.email });

    if (!user) {
      user = new User({
        login: payload.email || "",
        password: "",
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        role: "developer",
      });
      await user.save();
    }
    if (!user.firstName || !user.lastName) {
      return res.status(400).send("Required user information is incomplete.");
    }
    const jwtToken = generateToken(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      60 * 15
    );
    const newRefreshToken = generateToken(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      60 * 60 * 24
    );

    res
      .status(200)
      .send({ token: jwtToken, refreshToken: newRefreshToken, user });
  } catch (err) {
    const error = err as GenericError;
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
// ---------- PROJECT ----------------
const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Project = mongoose.model("Project", ProjectSchema);

app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.status(200).json(project);
  } catch (err) {
    console.error("Error creating tasks:", err);
    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});

app.post("/projects", async (req, res) => {
  try {
    console.log(req.body);
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error(`Error from server: ${err}`);

    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).send("Project not found");
    }
    res.status(200).json(updatedProject);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send("Project not found");
    }
    res.status(204).send();
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ error: error.toString() });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// -------- STORY -----------

const StorySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: String,
  description: String,
  status: String,
  createdAt: String,
  priority: String,
  ownerId: String,
});

const Story = mongoose.model("Story", StorySchema);
app.get("/stories", async (req, res) => {
  const { projectId } = req.query;
  try {
    const stories = await Story.find({ projectId });
    res.json(stories);
  } catch (err) {
    console.error("Error  tasks:", err);
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});
app.get("/stories", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.post("/stories", async (req, res) => {
  const { projectId, name, description, status, priority, createdAt, ownerId } =
    req.body;
  try {
    const newStory = new Story({
      projectId,
      name,
      description,
      status,
      priority,
      createdAt,
      ownerId,
    });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    console.error("Error creating tasks:", err);
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.put("/stories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedStory = await Story.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStory) {
      return res.status(404).send("Story not found");
    }
    res.json(updatedStory);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.delete("/stories/:id", async (req, res) => {
  try {
    const result = await Story.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send("Story not found");
    }
    res.status(204).send();
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Story",
  },
  estimatedTime: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["todo", "doing", "done"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  startAt: {
    type: Date,
    required: false,
  },
  endAt: {
    type: Date,
    required: false,
  },
  assignedUser: {
    type: String,
    required: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);
app.get("/tasks", async (req, res) => {
  try {
    const { storyId } = req.query;
    const tasks = await Task.find({ storyId });
    res.json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.json(task);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.json(task);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send("Task not found");
    }
    res.status(204).send();
  } catch (err) {
    const error = err as GenericError;
    res.status(500).send(error.message);
  }
});
