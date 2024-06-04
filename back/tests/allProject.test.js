import AllProject from "../controllers/project/all";
import HttpError from "../lib/HttpError";

describe("Get Projects", () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      params: { id: "1" },
      db: {
        Project: {
          findAll: jest.fn(),
        },
      },
      response: {
        body: {},
        status: 200,
      },
    };

    ctx.db.Project.findAll.mockResolvedValue([
      {
        project_name: "Project 1",
        project_description: "Description 1",
        project_deadline: new Date("2023-12-31"),
        project_team: 1,
      },
      {
        project_name: "Project 2",
        project_description: "Description 2",
        project_deadline: new Date("2024-06-30"),
        project_team: 1,
      },
    ]);
  });

  it("should return a list of projects successfully", async () => {
    await AllProject.getProjects(ctx);
    expect(ctx.status).toBe(200);
    expect(ctx.body.projects).toHaveLength(2);
    expect(ctx.body.projects[0]).toEqual({
      name: "Project 1",
      description: "Description 1",
      deadline: "2023-12-31",
    });
  });

  it("should return 400 if team ID is invalid", async () => {
    ctx.params.id = "invalid";
    await AllProject.getProjects(ctx);
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ error: "ID d'équipe invalide" });
  });

  it("should return 404 if no projects are found", async () => {
    ctx.db.Project.findAll.mockResolvedValue([]);
    await AllProject.getProjects(ctx);
    expect(ctx.status).toBe(404);
  });
});
