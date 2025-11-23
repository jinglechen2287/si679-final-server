import { Project } from "../types/Projects";
import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // for development only!
      methods: ["GET", "POST"]
    },
  });
  io.on("connection", (socket) => {
    console.log("A client  connected");
    socket.on("disconnect", (reason) => console.log("Client disconnected", reason));
  });
};

const updateProject = (projectId: string, updatedFields: Partial<Project>) => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  io.emit("updateProject", projectId, updatedFields);
};

export const socket = {
  initSocket,
  updateProject,
};
