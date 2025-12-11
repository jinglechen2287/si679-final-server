// This file should be the same as the client-side types/projects.ts
import { ObjectId } from "mongodb";
import { ProjectData } from "./ProjectData";

export type Project = ProjectData & {
    _id: ObjectId;
    name: string;
    created_at: Date;
}

export type Projects = Project[];