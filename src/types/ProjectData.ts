// This file should be the same as the client-side types/index.ts
// Except for Vector3Tuple, which is imported from three.js on the client side

export type Vector3Tuple = [number, number, number];

export type ObjType = "sphere" | "cube" | "cone";

export type Vec3InputType = "position" | "rotation" | "scale";

export type TriggerType = "click" | "hoverStart" | "hoverEnd" | "auto" | "";

export type Transform = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
};

export type ObjState = {
  id: string;
  transform: Transform;
  trigger: TriggerType;
  transitionTo: string;
};

export type SceneObj = {
  type: ObjType;
  name: string;
  states: ObjState[];
};

export type SceneData = {
  lightPosition: Vector3Tuple;
  content: {
    [id: string]: SceneObj;
  };
};

export type EditorMode = "edit" | "play";

export type CoreEditorData = {
  mode: EditorMode;
  selectedObjId: string | undefined;
  objStateIdxMap: Record<string, number>;
};

export type CameraData = {
  distance: number;
  origin: Readonly<Vector3Tuple>;
  yaw: number;
  pitch: number;
};

export type ProjectData = {
  scene: SceneData;
  editor: CoreEditorData;
  camera: CameraData;
  edited_by_client: string;
  edited_at: Date;
};
