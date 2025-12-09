import { projectControllers } from "../projectControllers";
import { projectServices } from "../../services/projectServices";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { Project } from "../../types/Projects";
import { createProject } from "../../services/createProject";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Project Controllers", () => {
  const id = new ObjectId("66d06117b547642de4798ccb");
  const notFoundId = new ObjectId("66d06117b547642de4798ccd");
  const project = createProject(id, "Test Project");

  const serviceError = new Error("Service failed");

  describe("getAllProjects", () => {
    it("should return all projects", async () => {
      const req = {} as Request;
      const res = { json: jest.fn() } as unknown as Response;
      projectServices.getAllProjects = jest.fn().mockResolvedValue([project]);
      await projectControllers.getAllProjects(req, res);
      expect(projectServices.getAllProjects).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([project]);
    });

    it("should throw an error if the service fails", async () => {
      const req = {} as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      projectServices.getAllProjects = jest
        .fn()
        .mockRejectedValue(serviceError);
      await projectControllers.getAllProjects(req, res);
      expect(projectServices.getAllProjects).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get all projects. ${serviceError}`
      );
    });
  });

  describe("getProjectById", () => {
    it("should return the project with the given id", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request<{
        id: string;
      }>;
      const res = { json: jest.fn() } as unknown as Response;
      projectServices.getProjectById = jest.fn().mockResolvedValue(project);
      await projectControllers.getProjectById(req, res);
      expect(projectServices.getProjectById).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(project);
    });

    it("should return a 500 error if the id is not found", async () => {
      const req = {
        params: { id: notFoundId.toString() },
      } as unknown as Request<{ id: string }>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const error = new Error("Article not found");
      projectServices.getProjectById = jest.fn().mockRejectedValue(error);
      await projectControllers.getProjectById(req, res);
      expect(projectServices.getProjectById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get project with id ${notFoundId}. ${error}`
      );
    });

    it("should return a 400 error if the id is not provided", async () => {
      const req = { params: { id: "" } } as unknown as Request<{ id: string }>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await projectControllers.getProjectById(req, res);
      expect(projectServices.getProjectById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Project ID is required");
    });

    it("should return a 500 error if the service fails", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request<{
        id: string;
      }>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      projectServices.getProjectById = jest
        .fn()
        .mockRejectedValue(serviceError);
      await projectControllers.getProjectById(req, res);
      expect(projectServices.getProjectById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get project with id ${id}. ${serviceError}`
      );
    });
  });

  describe("addProject", () => {
    it("should add a new project", async () => {
      const req = { body: project } as unknown as Request<
        {},
        {},
        { name: string | undefined }
      >;
      const res = { json: jest.fn() } as unknown as Response;
      projectServices.addProject = jest.fn().mockResolvedValue(project);
      await projectControllers.addProject(req, res);
      expect(projectServices.addProject).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(project);
    });

    it("should return a 500 error if the service fails", async () => {
      const req = { body: project } as unknown as Request<
        {},
        {},
        { name: string | undefined }
      >;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      projectServices.addProject = jest.fn().mockRejectedValue(serviceError);
      await projectControllers.addProject(req, res);
      expect(projectServices.addProject).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to add project. ${serviceError}`
      );
    });
  });

  describe("updateProject", () => {
    it("should update a project", async () => {
      const req = {
        params: { id: id.toString() },
        body: project,
      } as unknown as Request<{ id: string }, {}, Partial<Project>>;
      const res = { json: jest.fn() } as unknown as Response;
      projectServices.updateProject = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 1 });
      await projectControllers.updateProject(req, res);
      expect(projectServices.updateProject).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ modifiedCount: 1 });
    });

    it("should return a 400 error if the project is not provided correctly", async () => {
      const req = {
        params: { id: id.toString() },
        body: {},
      } as unknown as Request<{ id: string }, {}, Partial<Project>>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await projectControllers.updateProject(req, res);
      expect(projectServices.updateProject).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "At least one of scene, editor, or camera is required"
      );
    });

    it("should return a 400 error if the project id is not provided", async () => {
      const req = { params: { id: "" }, body: project } as unknown as Request<
        { id: string },
        {},
        Partial<Project>
      >;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await projectControllers.updateProject(req, res);
      expect(projectServices.updateProject).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Project ID is required");
    });

    it("should return a 500 error if the service fails", async () => {
      const req = {
        params: { id: id.toString() },
        body: project,
      } as unknown as Request<{ id: string }, {}, Partial<Project>>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      projectServices.updateProject = jest.fn().mockRejectedValue(serviceError);
      await projectControllers.updateProject(req, res);
      expect(projectServices.updateProject).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to update project with id ${id}. ${serviceError}`
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request<
        { id: string },
        {},
        {}
      >;
      const res = { json: jest.fn() } as unknown as Response;
      projectServices.deleteProject = jest
        .fn()
        .mockResolvedValue({ deletedCount: 1 });
      await projectControllers.deleteProject(req, res);
      expect(projectServices.deleteProject).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ deletedCount: 1 });
    });

    it("should return a 400 error if the project id is not provided", async () => {
      const req = { params: { id: "" } } as unknown as Request<
        { id: string },
        {},
        {}
      >;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await projectControllers.deleteProject(req, res);
      expect(projectServices.deleteProject).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Project ID is required");
    });
  });

  it("should return a 500 error if the service fails", async () => {
    const req = { params: { id: id.toString() } } as unknown as Request<
      { id: string },
      {},
      {}
    >;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    projectServices.deleteProject = jest.fn().mockRejectedValue(serviceError);
    await projectControllers.deleteProject(req, res);
    expect(projectServices.deleteProject).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      `Failed to delete project with id ${id}. ${serviceError}`
    );
  });
});
