import { userServices } from "../userServices";
import { db } from "../../db/db";
import { ObjectId } from "mongodb";

afterEach(() => {
  jest.clearAllMocks();
});

describe("User Service", () => {
  const id = new ObjectId("66d06117b547642de4798ccb");
  const user = {
    _id: id,
    username: "testuser",
    password: "testpassword",
    displayName: "Test User",
  };

  const databaseError = new Error("Database failed");

  describe("getAllUsers()", () => {
    it("should return all users", async () => {
      db.getAllInCollection = jest.fn().mockResolvedValue([user]);
      const result = await userServices.getAllUsers();
      expect(result).toEqual([user]);
    });

    it("should throw an error if the database fails", async () => {
      db.getAllInCollection = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.getAllUsers()).rejects.toThrow(
        `Failed to get all users. ${databaseError}`
      );
    });
  });

  describe("getUserById()", () => {
    it("should return the user with the given id", async () => {
      db.getFromCollectionById = jest.fn().mockResolvedValue(user);
      const result = await userServices.getUserById(id);
      expect(result).toEqual(user);
    });

    it("should throw an error if the id is not found", async () => {
      const error = new Error(`Item with id ${id} not found in users`);
      db.getFromCollectionById = jest.fn().mockRejectedValue(error);
      await expect(userServices.getUserById(id)).rejects.toThrow(
        `Failed to get user with id ${id}. ${error}`
      );
    });

    it("should throw an error if the database fails", async () => {
      db.getFromCollectionById = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.getUserById(id)).rejects.toThrow(
        `Failed to get user with id ${id}. ${databaseError}`
      );
    });
  });

  describe("addUser()", () => {
    it("should add a new user", async () => {
      db.getFromCollectionByField = jest.fn().mockResolvedValue(null);
      db.addToCollection = jest
        .fn()
        .mockResolvedValue({ insertedId: user._id });
      const result = await userServices.addUser(user);
      expect(result).toEqual(user);
    });

    it("should throw an error if the user already exists", async () => {
      db.getFromCollectionByField = jest.fn().mockResolvedValue(user);
      await expect(userServices.addUser(user)).rejects.toThrow(
        `User ${user.username} already exists`
      );
    });

    it("should throw an error if the database fails when checking if the user already exists", async () => {
      db.getFromCollectionByField = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.addUser(user)).rejects.toThrow(
        `Failed to check if user ${user.username} already exists. ${databaseError}`
      );
    });

    it("should throw an error if the user is not added", async () => {
      db.getFromCollectionByField = jest.fn().mockResolvedValue(null);
      db.addToCollection = jest.fn().mockResolvedValue({ insertedId: null });
      await expect(userServices.addUser(user)).rejects.toThrow(
        `Failed to add user ${user.username}. ${new Error(
          `Failed to add user ${user.username}`
        )}`
      );
    });

    it("should throw an error if the database fails when adding the user", async () => {
      db.getFromCollectionByField = jest.fn().mockResolvedValue(null);
      db.addToCollection = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.addUser(user)).rejects.toThrow(
        `Failed to add user ${user.username}. ${databaseError}`
      );
    });
  });

  describe("updateUser()", () => {
    it("should update a user", async () => {
      db.updateCollectionItem = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 1 });
      const result = await userServices.updateUser(id, user);
      expect(result).toEqual({ modifiedCount: 1 });
    });

    it("should throw an error if the user is not updated", async () => {
      db.updateCollectionItem = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 0 });
      await expect(userServices.updateUser(id, user)).rejects.toThrow(
        `Failed to update user with id ${id}. ${new Error(
          `Failed to update user with id ${id}`
        )}`
      );
    });
    it("should throw an error if the database fails", async () => {
      db.updateCollectionItem = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.updateUser(id, user)).rejects.toThrow(
        `Failed to update user with id ${id}. ${databaseError}`
      );
    });
  });

  describe("deleteUser()", () => {
    it("should delete a user", async () => {
      db.deleteFromCollectionById = jest
        .fn()
        .mockResolvedValue({ deletedCount: 1 });
      const result = await userServices.deleteUser(id);
      expect(result).toEqual({ deletedCount: 1 });
    });

    it("should throw an error if the user is not deleted", async () => {
      db.deleteFromCollectionById = jest
        .fn()
        .mockResolvedValue({ deletedCount: 0 });
      await expect(userServices.deleteUser(id)).rejects.toThrow(
        `Failed to delete user with id ${id}. ${new Error(
          `Failed to delete user with id ${id}`
        )}`
      );
    });
    it("should throw an error if the database fails", async () => {
      db.deleteFromCollectionById = jest.fn().mockRejectedValue(databaseError);
      await expect(userServices.deleteUser(id)).rejects.toThrow(
        `Failed to delete user with id ${id}. ${databaseError}`
      );
    });
  });
});
