import { CoreEditorData, CameraData, SceneData } from "../types/ProjectData";
import { ObjectId } from "mongodb";
import { Project } from "../types/Projects";
import { randomUUID } from "crypto";
import { SceneObj } from "../types/ProjectData";

export const createProject = (_id: ObjectId, name: string) => {
  const editor: CoreEditorData = {
    mode: "edit",
    selectedObjId: undefined,
    objStateIdxMap: {},
  };
  const camera: CameraData = {
    distance: 1,
    origin: [0, 0, 0],
    yaw: 1.5,
    pitch: -0.3,
  };
  const scene: SceneData = {
    lightPosition: [0.5, 0.5, 0.25],
    content: createDefaultSceneContent(),
  };
  const now = new Date();
  return {
    _id,
    name,
    created_at: now,
    edited_at: now,
    edited_by_client: "",
    editor,
    camera,
    scene,
  } as Project;
};

export const createDefaultSceneContent = () => {
  const content: Record<string, SceneObj> = {
    [randomUUID()]: {
      type: "sphere",
      name: "Sphere",
      states: [
        {
          id: randomUUID(),
          transform: {
            position: [0.2, 0.05, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          trigger: "",
          transitionTo: "",
        },
      ],
    },
    [randomUUID()]: {
      type: "cube",
      name: "Cube",
      states: [
        {
          id: randomUUID(),
          transform: {
            position: [0, 0, 0.2],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          trigger: "",
          transitionTo: "",
        },
      ],
    },
    [randomUUID()]: {
      type: "cone",
      name: "Cone",
      states: [
        {
          id: randomUUID(),
          transform: {
            position: [0, 0, -0.2],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          trigger: "",
          transitionTo: "",
        },
      ],
    },
  };
  return content;
};
