import { Project } from "./Projects";
import { User } from "./Users";

export type Collection = "projects" | "users";

export type CollectionFields<T extends Collection> = T extends "projects"
  ? Project
  : User;
