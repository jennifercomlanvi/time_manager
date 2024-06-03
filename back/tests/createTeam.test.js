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
});
