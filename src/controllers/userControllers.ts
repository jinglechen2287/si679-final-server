import { ObjectId } from "mongodb";
import { userServices } from "../services/userServices";
import { Request, Response } from "express";
import { User } from "../types/Users";

const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send(`Failed to get all users. ${error}`);
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("User ID is required");
    return;
  }
  try {
    const user = await userServices.getUserById(new ObjectId(id));
    res.json(user);
  } catch (error) {
    res.status(500).send(`Failed to get user with id ${id}. ${error}`);
  }
};

const addUser = async (
  req: Request<{}, {}, Omit<User, "_id">>,
  res: Response
) => {
  const user = req.body;
  if (!user.username || !user.password || !user.displayName) {
    res.status(400).send("Username, password, and display name are required");
    return;
  }
  try {
    const { _id } = await userServices.addUser(user);
    res.status(200).json({ id: _id });
  } catch (error) {
    res.status(500).send(`Failed to add user. ${error}`);
  }
};

const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }
  try {
    const userWithJWT = await userServices.validateLogin(username, password);
    res.status(200).json(userWithJWT);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid username")) {
      res.status(401).send(`Failed to login with username ${username}. ${error}`);
    } else {
        res.status(500).send(`Failed to login with username ${username}. ${error}`);
    }
  }
};

const updateUser = async (
  req: Request<{ id: string }, {}, Partial<User>>,
  res: Response
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("User ID is required");
    return;
  }
  const partialUser = req.body;
  if (
    !partialUser.username &&
    !partialUser.password &&
    !partialUser.displayName
  ) {
    res.status(400).send("Username, password, and display name are required");
    return;
  }
  try {
    const { modifiedCount } = await userServices.updateUser(
      new ObjectId(id),
      partialUser
    );
    res.json({ modifiedCount });
  } catch (error) {
    res.status(500).send(`Failed to update user with id ${id}. ${error}`);
  }
};

const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("User ID is required");
    return;
  }
  try {
    const { deletedCount } = await userServices.deleteUser(new ObjectId(id));
    res.json({ deletedCount });
  } catch (error) {
    res.status(500).send(`Failed to delete user with id ${id}. ${error}`);
  }
};

export const userControllers = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  login,
};
