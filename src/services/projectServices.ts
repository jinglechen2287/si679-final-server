import { ObjectId } from "mongodb";
import { Project } from "../types/Projects";
import { db } from "../db/db";
import { createProject } from "./createProject";

const getAllProjects = async () => {
  try {
    const projects = await db.getAllProjectsBasicInfo();
    return projects;
  } catch (error) {
    throw new Error(`Failed to get all projects. ${error}`);
  }
};

const getProjectById = async (id: ObjectId) => {
  try {
    const project = await db.getFromCollectionById("projects", id);
    return project;
  } catch (error) {
    throw new Error(`Failed to get project with id ${id}. ${error}`);
  }
};

const addProject = async (
  projectname: string | undefined,
) => {
  const _id = new ObjectId();
  const project = createProject(_id, projectname ?? _id.toString());
  try {
    const { insertedId } = await db.addToCollection("projects", project);
    if (!insertedId) {
      throw new Error(`Failed to add project ${project.name}`);
    }
    return { ...project, _id: insertedId };
  } catch (error) {
    throw new Error(`Failed to add project ${project.name}. ${error}`);
  }
};

const updateProject = async (id: ObjectId, project: Partial<Project>) => {
  try {
    const { modifiedCount } = await db.updateCollectionItem("projects", id, {
      ...project,
      edited_at: new Date(),
    });
    if (!modifiedCount) {
      throw new Error(`Failed to update project with id ${id}`);
    }
    return { modifiedCount };
  } catch (error) {
    throw new Error(`Failed to update project with id ${id}. ${error}`);
  }
};

const deleteProject = async (id: ObjectId) => {
  try {
    const { deletedCount } = await db.deleteFromCollectionById("projects", id);
    if (!deletedCount) {
      throw new Error(`Failed to delete project with id ${id}`);
    }
    return { deletedCount };
  } catch (error) {
    throw new Error(`Failed to delete project with id ${id}. ${error}`);
  }
};

export const projectServices = {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
};
