import { userControllers } from "../userControllers";
import { userServices } from "../../services/userServices";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { User } from "../../types/Users";

afterEach(() => {
  jest.clearAllMocks();
});

describe("User Controllers", () => {
  const id = new ObjectId("66d06117b547642de4798ccb");
  const notFoundId = new ObjectId("66d06117b547642de4798ccd");
  const user = {
    _id: id,
    username: "testuser",
    password: "testpassword",
    displayName: "Test User",
  };

  const serviceError = new Error("Service failed");

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const req = {} as Request;
      const res = { json: jest.fn() } as unknown as Response;
      userServices.getAllUsers = jest.fn().mockResolvedValue([user]);
      await userControllers.getAllUsers(req, res);
      expect(userServices.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([user]);
    });

    it("should throw an error if the service fails", async () => {
      const req = {} as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.getAllUsers = jest.fn().mockRejectedValue(serviceError);
      await userControllers.getAllUsers(req, res);
      expect(userServices.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get all users. ${serviceError}`
      );
    });
  });

  describe("getUserById", () => {
    it("should return a user by id", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request;
      const res = { json: jest.fn() } as unknown as Response;
      userServices.getUserById = jest.fn().mockResolvedValue(user);
      await userControllers.getUserById(req, res);
      expect(userServices.getUserById).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return a 500 error if the user is not found", async () => {
      const req = {
        params: { id: notFoundId.toString() },
      } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.getUserById = jest.fn().mockRejectedValue(serviceError);
      await userControllers.getUserById(req, res);
      expect(userServices.getUserById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get user with id ${notFoundId}. ${serviceError}`
      );
    });

    it("should return a 400 error if the user id is not provided", async () => {
      const req = { params: { id: "" } } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.getUserById(req, res);
      expect(userServices.getUserById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("User ID is required");
    });

    it("should return a 500 error if the service fails", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.getUserById = jest.fn().mockRejectedValue(serviceError);
      await userControllers.getUserById(req, res);
      expect(userServices.getUserById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to get user with id ${id}. ${serviceError}`
      );
    });
  });

  describe("addUser", () => {
    it("should add a new user", async () => {
      const req = { body: user } as unknown as Request;
      const res = { json: jest.fn().mockReturnThis(), status: jest.fn().mockReturnThis() } as unknown as Response;
      userServices.addUser = jest.fn().mockResolvedValue({ _id: id });
      await userControllers.addUser(req, res);
      expect(userServices.addUser).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ id: id });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return a 400 error if the user is not provided correctly", async () => {
      const req = { body: { username: "testuser" } } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.addUser(req, res);
      expect(userServices.addUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Username, password, and display name are required"
      );
    });

    it("should return a 500 error if the service fails", async () => {
      const req = { body: user } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.addUser = jest.fn().mockRejectedValue(serviceError);
      await userControllers.addUser(req, res);
      expect(userServices.addUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to add user. ${serviceError}`
      );
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      } as unknown as Request;
      const res = { json: jest.fn().mockReturnThis(), status: jest.fn().mockReturnThis() } as unknown as Response;
      userServices.validateLogin = jest.fn().mockResolvedValue(user);
      await userControllers.login(req, res);
      expect(userServices.validateLogin).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return a 400 error if the username or password is not provided", async () => {
      const req = { body: { username: "testuser" } } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.login(req, res);
      expect(userServices.validateLogin).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Username and password are required"
      );
    });

    it("should return a 401 error if the username or password is incorrect", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const error = new Error("Invalid username or password");
      userServices.validateLogin = jest.fn().mockRejectedValue(error);
      await userControllers.login(req, res);
      expect(userServices.validateLogin).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to login with username testuser. ${error}`
      );
    });

    it("should return a 500 error if the service fails", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      } as unknown as Request;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.validateLogin = jest.fn().mockRejectedValue(serviceError);
      await userControllers.login(req, res);
      expect(userServices.validateLogin).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to login with username testuser. ${serviceError}`
      );
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const req = {
        params: { id: id.toString() },
        body: user,
      } as unknown as Request<{ id: string }, {}, Partial<User>>;
      const res = { json: jest.fn() } as unknown as Response;
      userServices.updateUser = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      await userControllers.updateUser(req, res);
      expect(userServices.updateUser).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ modifiedCount: 1 });
    });

    it("should return a 400 error if the user is not provided correctly", async () => {
      const req = {
        params: { id: id.toString() },
        body: {},
      } as unknown as Request<{ id: string }, {}, Partial<User>>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.updateUser(req, res);
      expect(userServices.updateUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Username, password, and display name are required"
      );
    });

    it("should return a 400 error if the user id is not provided", async () => {
      const req = { params: { id: "" }, body: user } as unknown as Request<
        { id: string },
        {},
        Partial<User>
      >;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.updateUser(req, res);
      expect(userServices.updateUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("User ID is required");
    });

    it("should return a 500 error if the service fails", async () => {
      const req = {
        params: { id: id.toString() },
        body: user,
      } as unknown as Request<{ id: string }, {}, Partial<User>>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.updateUser = jest.fn().mockRejectedValue(serviceError);
      await userControllers.updateUser(req, res);
      expect(userServices.updateUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to update user with id ${id}. ${serviceError}`
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request<{
        id: string;
      }>;
      const res = { json: jest.fn() } as unknown as Response;
      userServices.deleteUser = jest.fn().mockResolvedValue({ deletedCount: 1 });
      await userControllers.deleteUser(req, res);
      expect(userServices.deleteUser).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ deletedCount: 1 });
    });

    it("should return a 400 error if the user id is not provided", async () => {
      const req = { params: { id: "" } } as unknown as Request<{ id: string }>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      await userControllers.deleteUser(req, res);
      expect(userServices.deleteUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("User ID is required");
    });

    it("should return a 500 error if the service fails", async () => {
      const req = { params: { id: id.toString() } } as unknown as Request<{
        id: string;
      }>;
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      userServices.deleteUser = jest.fn().mockRejectedValue(serviceError);
      await userControllers.deleteUser(req, res);
      expect(userServices.deleteUser).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        `Failed to delete user with id ${id}. ${serviceError}`
      );
    });
  });
});
