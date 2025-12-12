import { createProject, createDefaultSceneContent } from "../createProject";
import { ObjectId } from "mongodb";

jest.mock("crypto", () => ({
  randomUUID: () => "test-uuid-1234",
}));

describe("createProject", () => {
  it("should create a project", () => {
    const id = new ObjectId();
    const project = createProject(id, "Test Project");
    expect(project).toEqual({
      _id: id,
      name: "Test Project",
      created_at: expect.any(Date),
      edited_at: expect.any(Date),
      edited_by_client: "",
      editor: {
        mode: "edit",
        selectedObjId: undefined,
        objStateIdxMap: {},
      },
      camera: {
        distance: 1,
        origin: [0, 0, 0],
        yaw: 1.5,
        pitch: -0.3,
      },
      scene: {
        lightPosition: [0.5, 0.5, 0.25],
        content: createDefaultSceneContent(),
      },
    });
  });
});