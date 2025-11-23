import { ObjectId } from "mongodb";
import { projectServices } from "../services/projectServices";
import { Request, Response } from "express";
import { Project } from "../types/Projects";

const getAllProjects = async (_: Request, res: Response) => {
  try {
    const projects = await projectServices.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).send(`Failed to get all projects. ${error}`);
  }
};

const getProjectById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Project ID is required");
    return;
  }
  try {
    const project = await projectServices.getProjectById(new ObjectId(id));
    res.json(project);
  } catch (error) {
    res.status(500).send(`Failed to get project with id ${id}. ${error}`);
  }
};

const addProject = async (req: Request<{}, {}, { name: string | undefined }>, res: Response) => {
  const projectname = req.body.name;
  try {
    const project = await projectServices.addProject(projectname);
    res.json(project);
  } catch (error) {
    res.status(500).send(`Failed to add project. ${error}`);
  }
};

const updateProject = async (
  req: Request<{ id: string }, {}, Partial<Project>>,
  res: Response
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Project ID is required");
    return;
  }
  const partialProject = req.body;
  if (
    !partialProject.scene &&
    !partialProject.editor &&
    !partialProject.camera
  ) {
    res
      .status(400)
      .send("At least one of scene, editor, or camera is required");
    return;
  }
  try {
    const { modifiedCount } = await projectServices.updateProject(
      new ObjectId(id),
      partialProject
    );
    res.json({ modifiedCount });
  } catch (error) {
    res.status(500).send(`Failed to update project with id ${id}. ${error}`);
  }
};

const deleteProject = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Project ID is required");
    return;
  }
  try {
    const { deletedCount } = await projectServices.deleteProject(
      new ObjectId(id)
    );
    res.json({ deletedCount });
  } catch (error) {
    res.status(500).send(`Failed to delete project with id ${id}. ${error}`);
  }
};

export const projectControllers = {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
};
