import { CoreEditorData, CameraData, SceneData } from "../types/ProjectData";
import { ObjectId } from "mongodb";
import { Project } from "../types/Projects";
import { v4 as uuidv4 } from "uuid";
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

const createDefaultSceneContent = () => {
  const content: Record<string, SceneObj> = {
    [uuidv4()]: {
      type: "sphere",
      name: "Sphere",
      states: [
        {
          id: uuidv4(),
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
    [uuidv4()]: {
      type: "cube",
      name: "Cube",
      states: [
        {
          id: uuidv4(),
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
    [uuidv4()]: {
      type: "cone",
      name: "Cone",
      states: [
        {
          id: uuidv4(),
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
