import { ObjectId } from "mongodb";
import { ProjectData } from "./ProjectData";

export type Project = ProjectData & {
    _id: ObjectId;
    name: string;
    created_at: Date;
}

export type Projects = Project[];