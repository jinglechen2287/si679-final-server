import { ObjectId } from "mongodb";
import { CameraData, CoreEditorData, SceneData } from "./ProjectsData";

export interface Project {
    _id: ObjectId;
    name: string;
    created_at: Date;
    edited_at: Date;
    edited_by_client: string;
    scene: SceneData;
    editor: CoreEditorData;
    camera: CameraData;
}

export type Projects = Project[];