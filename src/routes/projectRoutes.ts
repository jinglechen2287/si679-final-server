import express from "express";
import { projectControllers } from "../controllers/projectControllers";
import { validateJWT } from "../middleware/validateJWT";

const projectRouter = express.Router();

projectRouter.get("/", projectControllers.getAllProjects);
projectRouter.post("/", validateJWT, projectControllers.addProject);

projectRouter.get("/:id", projectControllers.getProjectById);
projectRouter.patch("/:id", projectControllers.updateProject);
projectRouter.delete("/:id", validateJWT, projectControllers.deleteProject);

export { projectRouter };