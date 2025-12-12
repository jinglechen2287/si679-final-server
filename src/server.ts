import express from "express";
import { userRouter } from "./routes/userRoutes";
import { projectRouter } from "./routes/projectRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { projectServices } from "./services/projectServices";

import cors from "cors";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import { socket } from "./socket/clientUpdate";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);

projectServices.watchProjects();

app.use(errorHandler);

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || "localhost-key.pem"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || "localhost.pem"),
};

const server = https.createServer(httpsOptions, app);

socket.initSocket(server);

server.listen(port, () => {
  console.log(`HTTPS server running at https://localhost:${port}`);
});
