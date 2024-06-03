import { index } from "../controllers/team/create";

describe("Create Team", () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      request: {
        body: {
          name: "Team A",
          description: "Une description valide de plus de 10 caractères.",
        },
      },
      db: {
        Team: {
          findOne: jest.fn(),
          create: jest.fn(),
        },
        Permission: {
          create: jest.fn(),
          LEVELS: { ADMIN: 1 },
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

    ctx.db.Team.findOne.mockResolvedValue(null);
    ctx.db.Team.create.mockResolvedValue({
      team_name: ctx.request.body.name,
      team_description: ctx.request.body.description,
      team_id: 1,
    });
    ctx.db.Permission.create.mockResolvedValue({
      perm_user: ctx.state.user.id,
      perm_team: 1,
      perm_level: 1,
    });
  });

  it("should successfully create a new team", async () => {
    await index(ctx);
    expect(ctx.response.body).toHaveProperty("team");
    expect(ctx.db.Team.findOne).toHaveBeenCalledWith({
      where: { team_name: "Team A" },
    });
    expect(ctx.db.Team.create).toHaveBeenCalledWith({
      team_name: "Team A",
      team_description: "Une description valide de plus de 10 caractères.",
    });
  });

  it("should return 400 if team name is already taken", async () => {
    ctx.db.Team.findOne.mockResolvedValue({
      team_name: "Team A",
    });

    await index(ctx);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body).toEqual({ error: "Cette équipe existe déjà" });
  });

  it("should return 400 if description is too short", async () => {
    ctx.request.body.description = "Trop court";

    await index(ctx);

    expect(ctx.response.status).toBe(400);
    expect(ctx.response.body).toEqual({
      error: "Validation",
      details: {
        description: ["La description doit avoir au moins 10 caractères"]
      }
    });
  });

  it("should handle database errors gracefully", async () => {
    ctx.db.Team.create.mockRejectedValue(new Error("DB Error"));

    await index(ctx);

    expect(ctx.response.status).toBe(500);
    expect(ctx.response.body).toEqual({
      error: "Erreur interne du serveur",
    });
  });
});
