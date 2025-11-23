import { db } from "../db/db";
import { User } from "../types/Users";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const PRIVATE_KEY = fs.readFileSync("jwt.key", "utf8");

const SALT_ROUNDS = 12;

const getAllUsers = async () => {
  try {
    const users = await db.getAllInCollection("users");
    return users;
  } catch (error) {
    throw new Error(`Failed to get all users. ${error}`);
  }
};

const getUserById = async (id: ObjectId) => {
  try {
    const user = await db.getFromCollectionById("users", id);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user with id ${id}. ${error}`);
  }
};

const addUser = async (user: Omit<User, "_id">) => {
  try {
    const existingUser = await db.getFromCollectionByField(
      "users",
      "username",
      user.username
    );
    if (existingUser) {
      throw new Error(`User ${user.username} already exists`);
    }
  } catch (error) {
    throw new Error(
      `Failed to check if user ${user.username} already exists. ${error}`
    );
  }

  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  try {
    const { insertedId } = await db.addToCollection("users", {
      ...user,
      _id: new ObjectId(),
      password: hashedPassword,
    });
    if (!insertedId) {
      throw new Error(`Failed to add user ${user.username}`);
    }
    return { ...user, _id: insertedId };
  } catch (error) {
    throw new Error(`Failed to add user ${user.username}. ${error}`);
  }
};

const updateUser = async (id: ObjectId, partialUser: Partial<User>) => {
  if (partialUser.password) {
    partialUser.password = await bcrypt.hash(partialUser.password, SALT_ROUNDS);
  }
  try {
    const { modifiedCount } = await db.updateCollectionItem(
      "users",
      id,
      partialUser
    );
    if (!modifiedCount) {
      throw new Error(`Failed to update user with id ${id}`);
    }
    return { modifiedCount };
  } catch (error) {
    throw new Error(`Failed to update user with id ${id}. ${error}`);
  }
};

const deleteUser = async (id: ObjectId) => {
  try {
    const { deletedCount } = await db.deleteFromCollectionById("users", id);
    if (!deletedCount) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
    return { deletedCount };
  } catch (error) {
    throw new Error(`Failed to delete user with id ${id}. ${error}`);
  }
};

const generateToken = (userId: ObjectId) => {
  const data = {
    time: Date.now(),
    userId,
  };
  return jwt.sign(data, PRIVATE_KEY, { algorithm: "RS256", expiresIn: "1h" });
};

const validateLogin = async (username: string, password: string) => {
  const user = await db.getFromCollectionByField("users", "username", username);
  if (!user) {
    throw new Error("Invalid username");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }
  const jwt = generateToken(user._id);
  return {
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
    },
    jwt,
  };
};

export const userServices = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  validateLogin,
};
