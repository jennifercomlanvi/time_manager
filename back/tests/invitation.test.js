import Invitation from "../controllers/invitation/create";
import HttpError from "../lib/HttpError";
import { generateToken } from "../lib/token";
const sendEmail = require("../emailSender");


jest.mock("../emailSender");
jest.mock("../lib/token", () => ({
  generateToken: jest.fn(),
}));

describe("Invitation", () => {
    let ctx;
  
    beforeEach(() => {
      ctx = {
        request: {
          body: {
            email: "test@example.com",
            teamId: 1,
          },
        },
        db: {
          User: {
            findOne: jest.fn(),
          },
          Team: {
            findByPk: jest.fn(),
          },
          Invitation: {
            findOrCreate: jest.fn(),
          },
        },
        state: {
          user: {
            id: 1,
          },
        },
        config: {
          jwt_secret: "secret",
        },
        response: {
          body: {},
          status: 200,
        },
      };
  
      generateToken.mockReturnValue("invitationToken");
      sendEmail.mockResolvedValue(true);
    });
  
    // it("should create an invitation successfully", async () => {
    //   ctx.db.User.findOne.mockResolvedValue(null);
    //   ctx.db.Team.findByPk.mockResolvedValue({ team_name: "Test Team", hasUser: jest.fn().mockResolvedValue(false) });
    //   ctx.db.Invitation.findOrCreate.mockResolvedValue([{ inv_token: "invitationToken" }, true]);
  
    //   await Invitation.create(ctx);
  
    //   expect(ctx.db.User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
    //   expect(ctx.db.Team.findByPk).toHaveBeenCalledWith(1);
    //   expect(ctx.db.Invitation.findOrCreate).toHaveBeenCalledWith({
    //     where: { inv_email: "test@example.com", inv_team: 1 },
    //     defaults: {
    //       inv_token: "invitationToken",
    //       inv_status: 1,
    //       expired_at: expect.any(Date),
    //     },
    //   });
    //   expect(sendEmail).toHaveBeenCalledWith(
    //     "test@example.com",
    //     "Invitation à rejoindre l'équipe Test Team",
    //     expect.any(String)
    //   );
    //   expect(ctx.status).toBe(200);
    //   expect(ctx.response.body).toEqual({ message: "Invitation créée avec succès" });
    // });
  
    it("should return 400 if email is invalid", async () => {
      ctx.request.body.email = "invalid-email";
  
      await expect(Invitation.create(ctx)).rejects.toThrow(HttpError);
      await expect(Invitation.create(ctx)).rejects.toMatchObject({ status: 400, message: "Erreur de validation" });
    });
  
    // it("should return 404 if team is not found", async () => {
    //   ctx.db.Team.findByPk.mockResolvedValue(null);
  
    //   await expect(Invitation.create(ctx)).rejects.toThrow(HttpError);
    //   await expect(Invitation.create(ctx)).rejects.toMatchObject({ status: 404, message: "Équipe non trouvée." });
    // });
  
    // it("should return 400 if user is already a member of the team", async () => {
    //   const userMock = { id: 2 };
    //   const teamMock = { id: 1, hasUser: jest.fn().mockResolvedValue(true) };
    //   ctx.db.User.findOne.mockResolvedValue(userMock);
    //   ctx.db.Team.findByPk.mockResolvedValue(teamMock);
  
    //   await expect(Invitation.create(ctx)).rejects.toThrow(HttpError);
    //   await expect(Invitation.create(ctx)).rejects.toMatchObject({ status: 400, message: "L'utilisateur est déjà membre de l'équipe." });
    // });
  
  });