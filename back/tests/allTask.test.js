import TasksByProject from "../controllers/task/all";
import HttpError from "../lib/HttpError";

describe("TasksByProject", () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      params: {
        id: 1,
      },
      db: {
        Project: {
          findByPk: jest.fn(),
        },
        Task: {
          findAll: jest.fn(),
        },
      },
      state: {
        user: {
          id: 1,
        },
      },
      response: {
        body: {},
        status: 200,
      },
    };
  });

  it("should return a list of tasks successfully", async () => {
    ctx.db.Project.findByPk.mockResolvedValue({ id: 1 });
    ctx.db.Task.findAll.mockResolvedValue([
      { task_name: "Task 1", task_description: "Description 1", task_state: "open" },
      { task_name: "Task 2", task_description: "Description 2", task_state: "in progress" },
    ]);

    await TasksByProject.index(ctx);

    expect(ctx.db.Project.findByPk).toHaveBeenCalledWith(1);
    expect(ctx.db.Task.findAll).toHaveBeenCalledWith({ where: { task_project: 1 } });
    expect(ctx.status).toBe(200);
    expect(ctx.body.tasks).toHaveLength(2);
    expect(ctx.body.tasks[0]).toEqual({
      name: "Task 1",
      description: "Description 1",
      state: "open",
    });
  });

  it("should return 404 if project is not found", async () => {
    ctx.db.Project.findByPk.mockResolvedValue(null);

    await TasksByProject.index(ctx);

    expect(ctx.db.Project.findByPk).toHaveBeenCalledWith(1);
    expect(ctx.status).toBe(404);
  });

  it("should return 404 if no tasks are found", async () => {
    ctx.db.Project.findByPk.mockResolvedValue({ id: 1 });
    ctx.db.Task.findAll.mockResolvedValue([]);

    await TasksByProject.index(ctx);

    expect(ctx.db.Project.findByPk).toHaveBeenCalledWith(1);
    expect(ctx.db.Task.findAll).toHaveBeenCalledWith({ where: { task_project: 1 } });
    expect(ctx.status).toBe(404);
  });

  it("should handle internal server errors gracefully", async () => {
    ctx.db.Project.findByPk.mockRejectedValue(new Error("DB Error"));

    await expect(TasksByProject.index(ctx)).rejects.toThrow(HttpError);
    await expect(TasksByProject.index(ctx)).rejects.toMatchObject({ status: 500, message: "Erreur interne du serveur" });
  });
});
