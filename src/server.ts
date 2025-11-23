import express from "express";
import { userRouter } from "./routes/userRoutes";
import { projectRouter } from "./routes/projectRoutes";
import { errorHandler } from "./middleware/errorHandler";

import cors from "cors";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/users", userRouter);
app.use("/projects", projectRouter);

app.use(errorHandler);

const httpsOptions = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`HTTPS server running at https://localhost:${port}`);
});
