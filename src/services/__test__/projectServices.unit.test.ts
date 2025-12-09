import { projectServices } from "../projectServices";
import { db } from "../../db/db";
import { ObjectId } from "mongodb";
import { createProject } from "../createProject";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Project Service", () => {
  const id = new ObjectId("66d06117b547642de4798ccb");
  const project = createProject(id, "Test Project");

  const databaseError = new Error("Database failed");

  describe("getAllProjects()", () => {
    it("should return all projects", async () => {
      db.getAllProjectsBasicInfo = jest.fn().mockResolvedValue([project]);
      const result = await projectServices.getAllProjects();
      expect(result).toEqual([project]);
    });

    it("should throw an error if the database fails", async () => {
      db.getAllProjectsBasicInfo = jest.fn().mockRejectedValue(databaseError);
      await expect(projectServices.getAllProjects()).rejects.toThrow(
        `Failed to get all projects. ${databaseError}`
      );
    });
  });

  describe("getProjectById()", () => {
    it("should return the project with the given id", async () => {
      db.getFromCollectionById = jest.fn().mockResolvedValue(project);
      const result = await projectServices.getProjectById(id);
      expect(result).toEqual(project);
    });

    it("should throw an error if the id is not found", async () => {
      const error = new Error(`Item with id ${id} not found in projects`);
      db.getFromCollectionById = jest.fn().mockRejectedValue(error);
      await expect(projectServices.getProjectById(id)).rejects.toThrow(
        `Failed to get project with id ${id}. ${error}`
      );
    });

    it("should throw an error if the database fails", async () => {
      db.getFromCollectionById = jest.fn().mockRejectedValue(databaseError);
      await expect(projectServices.getProjectById(id)).rejects.toThrow(
        `Failed to get project with id ${id}. ${databaseError}`
      );
    });
  });

  describe("addProject()", () => {
    it("should add a new project", async () => {
      db.addToCollection = jest
        .fn()
        .mockResolvedValue({ insertedId: project._id });
      const result = await projectServices.addProject(project.name);
      const now = new Date();
      result.created_at = now;
      result.edited_at = now;
      expect(result).toEqual({ ...project, created_at: now, edited_at: now });
    });

    it("should throw an error if the project is not added", async () => {
      db.addToCollection = jest.fn().mockResolvedValue({ insertedId: null });
      await expect(projectServices.addProject(project.name)).rejects.toThrow(
        `Failed to add project ${project.name}. ${new Error(
          `Failed to add project ${project.name}`
        )}`
      );
    });

    it("should throw an error if the database fails", async () => {
      db.addToCollection = jest.fn().mockRejectedValue(databaseError);
      await expect(projectServices.addProject(project.name)).rejects.toThrow(
        `Failed to add project ${project.name}. ${databaseError}`
      );
    });
  });

  describe("updateProject()", () => {
    it("should update a project", async () => {
      db.updateCollectionItem = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 1 });
      const result = await projectServices.updateProject(id, project);
      expect(result).toEqual({ modifiedCount: 1 });
    });

    it("should throw an error if the project is not updated", async () => {
      db.updateCollectionItem = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 0 });
      await expect(projectServices.updateProject(id, project)).rejects.toThrow(
        `Failed to update project with id ${id}. ${new Error(
          `Failed to update project with id ${id}`
        )}`
      );
    });

    it("should throw an error if the database fails", async () => {
      db.updateCollectionItem = jest.fn().mockRejectedValue(databaseError);
      await expect(projectServices.updateProject(id, project)).rejects.toThrow(
        `Failed to update project with id ${id}. ${databaseError}`
      );
    });
  });

  describe("deleteProject()", () => {
    it("should delete a project", async () => {
      db.deleteFromCollectionById = jest
        .fn()
        .mockResolvedValue({ deletedCount: 1 });
      const result = await projectServices.deleteProject(id);
      expect(result).toEqual({ deletedCount: 1 });
    });

    it("should throw an error if the project is not deleted", async () => {
      db.deleteFromCollectionById = jest
        .fn()
        .mockResolvedValue({ deletedCount: 0 });
      await expect(projectServices.deleteProject(id)).rejects.toThrow(
        `Failed to delete project with id ${id}. ${new Error(
          `Failed to delete project with id ${id}`
        )}`
      );
    });

    it("should throw an error if the database fails", async () => {
      db.deleteFromCollectionById = jest.fn().mockRejectedValue(databaseError);
      await expect(projectServices.deleteProject(id)).rejects.toThrow(
        `Failed to delete project with id ${id}. ${databaseError}`
      );
    });
  });
});
