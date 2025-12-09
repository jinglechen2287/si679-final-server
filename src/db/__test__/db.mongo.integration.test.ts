import { MongoMemoryServer } from "mongodb-memory-server";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { db } from "../db";

dotenv.config();

describe("DB module", () => {
  let mongoMemoryServer: MongoMemoryServer | null = null;

  const testId = new ObjectId();
  const testUsername = "testuser";
  const user = {
    _id: testId,
    username: testUsername,
    password: "testpassword",
    displayName: "Test User",
  };

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoMemoryServer.getUri();
    console.log(process.env.MONGO_URI);
    await db.init();
  });

  afterAll(async () => {
    await db.close();
    await mongoMemoryServer?.stop();
  });

  describe("getAllInCollection", () => {
    it("should return an empty array if the users collection is empty", async () => {
      const result = await db.getAllInCollection("users");
      expect(result).toEqual([]);
    });
  });

  describe("addToCollection", () => {
    it("should add a user document to the users collection", async () => {
      const result = await db.addToCollection("users", user);
      expect(result.insertedId).toEqual(testId);
    });

    it("should throw when inserting duplicate _id", async () => {
      await expect(db.addToCollection("users", user)).rejects.toThrow(
        `Failed to add document to users. MongoServerError: E11000 duplicate key error collection: hybrid-authoring.users index: _id_ dup key: { _id: ObjectId('${testId}') }`
      );
    });
  });

  describe("getAllInCollection", () => {
    it("should return all documents from the users collection", async () => {
      const result = await db.getAllInCollection("users");
      expect(result).toEqual([user]);
    });
  });

  describe("getFromCollectionById", () => {
    it("should return a user document from the users collection by id", async () => {
      const result = await db.getFromCollectionById("users", testId);
      expect(result).toEqual(user);
    });

    it("should throw an error if the user document is not found", async () => {
      const newTestId = new ObjectId();
      await expect(
        db.getFromCollectionById("users", newTestId)
      ).rejects.toThrow(`Item with id ${newTestId} not found in users`);
    });
  });

  describe("getFromCollectionByField", () => {
    it("should return a user document from the users collection by username", async () => {
      const result = await db.getFromCollectionByField(
        "users",
        "username",
        testUsername
      );
      expect(result).toEqual(user);
    });

    it("should return null if the user document is not found", async () => {
      const result = await db.getFromCollectionByField("users", "username", "nonexistentuser");
      expect(result).toEqual(null);
    });
  });

  describe("updateCollectionItem", () => {
    it("should update a user document in the users collection", async () => {
      const result = await db.updateCollectionItem("users", testId, {
        displayName: "Updated Test User",
      });
      expect(result.modifiedCount).toEqual(1);
    });

    it("should ignore _id in update data", async () => {
      const newTestId = new ObjectId();
      await db.updateCollectionItem("users", testId, {
        _id: newTestId,
        displayName: "Another Name",
      });
      const updated = await db.getFromCollectionById("users", testId);
      expect(updated._id).toEqual(testId);
      expect(updated.displayName).toEqual("Another Name");
    });

    it("should throw an error if the user document is not found", async () => {
      const newTestId = new ObjectId();
      const result = await db.updateCollectionItem("users", newTestId, {
        displayName: "Updated Test User",
      });
      expect(result.modifiedCount).toEqual(0);
    });
  });

  describe("deleteFromCollectionById", () => {
    it("should delete a user document from the users collection by id", async () => {
      const result = await db.deleteFromCollectionById("users", testId);
      expect(result.deletedCount).toEqual(1);
    });

    it("should return 0 when deleting an already deleted document", async () => {
      const result = await db.deleteFromCollectionById("users", testId);
      expect(result.deletedCount).toEqual(0);
    });
  });

  describe("getAllInCollection after delete", () => {
    it("should return an empty array from the users collection", async () => {
      const result = await db.getAllInCollection("users");
      expect(result).toEqual([]);
    });
  });
});
