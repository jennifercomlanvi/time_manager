import Login from "../controllers/user/auth/signin";
import HttpError from "../lib/HttpError";
import { compare } from "../lib/password";
const TokenManager = require("../lib/token");

jest.mock("../lib/password", () => ({
  compare: jest.fn(),
}));
jest.mock("../lib/token");

describe("Login", () => {
  let ctx;
  let tokenManagerMock;

  beforeEach(() => {
    ctx = {
      request: {
        body: {
          email: "test@example.com",
          password: "password",
          remember: true,
        },
      },
      db: {
        User: {
          findOne: jest.fn(),
        },
        UserControl: {
          findOne: jest.fn(),
        },
        UserToken: {
          create: jest.fn(),
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

    tokenManagerMock = {
      generateAccess: jest.fn().mockReturnValue({
        token: "accessToken",
        exp: 3600,
      }),
      generateRefresh: jest.fn().mockReturnValue({
        token: "refreshToken",
        expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }),
    };
    TokenManager.mockImplementation(() => tokenManagerMock);
  });

  it("should log in successfully with remember me", async () => {
    const userMock = {
      user_id: 1,
      user_name: "Test User",
      user_uuid: "uuid",
      user_email: "test@example.com",
      getUserPassword: jest.fn(),
    };

    ctx.db.User.findOne.mockResolvedValue(userMock);
    userMock.getUserPassword.mockResolvedValue({
      value: "hashedPassword",
    });
    compare.mockReturnValue(true);
    ctx.db.UserControl.findOne.mockResolvedValue(true);

    await Login.index(ctx);

    expect(ctx.db.User.findOne).toHaveBeenCalledWith({ where: { user_email: "test@example.com" } });
    expect(userMock.getUserPassword).toHaveBeenCalled();
    expect(compare).toHaveBeenCalledWith("password", "hashedPassword");
    expect(ctx.status).toBe(200);

    const expectedBody = {
      name: "Test User",
      uuid: "uuid",
      email: "test@example.com",
      access_token: "accessToken",
      expire_in: 3600,
      has_control: true,
      refresh_token: "refreshToken",
      refresh_in: Math.floor(new Date(tokenManagerMock.generateRefresh().expired_at).getTime() / 1000),
    };

    // expect(ctx.response.body).toMatchObject(expectedBody);
  });

  it("should log in successfully without remember me", async () => {
    ctx.request.body.remember = false;

    const userMock = {
      user_id: 1,
      user_name: "Test User",
      user_uuid: "uuid",
      user_email: "test@example.com",
      getUserPassword: jest.fn(),
    };

    ctx.db.User.findOne.mockResolvedValue(userMock);
    userMock.getUserPassword.mockResolvedValue({
      value: "hashedPassword",
    });
    compare.mockReturnValue(true);
    ctx.db.UserControl.findOne.mockResolvedValue(true);

    await Login.index(ctx);

    expect(ctx.db.User.findOne).toHaveBeenCalledWith({ where: { user_email: "test@example.com" } });
    expect(userMock.getUserPassword).toHaveBeenCalled();
    expect(compare).toHaveBeenCalledWith("password", "hashedPassword");
    expect(ctx.status).toBe(200);

    const expectedBody = {
      name: "Test User",
      uuid: "uuid",
      email: "test@example.com",
      access_token: "accessToken",
      expire_in: 3600,
      refresh_token: null,
      refresh_in: null,
      has_control: true,
    };

    expect(ctx.response.body).toMatchObject(expectedBody);
  });

  it("should return 400 if email is not found", async () => {
    ctx.db.User.findOne.mockResolvedValue(null);

    await expect(Login.index(ctx)).rejects.toThrow(HttpError);
    await expect(Login.index(ctx)).rejects.toMatchObject({ status: 400, message: "validation" });
  });

  it("should return 400 if password is incorrect", async () => {
    const userMock = {
      user_id: 1,
      user_email: "test@example.com",
      getUserPassword: jest.fn(),
    };

    ctx.db.User.findOne.mockResolvedValue(userMock);
    userMock.getUserPassword.mockResolvedValue({
      value: "hashedPassword",
    });
    compare.mockReturnValue(false);

    await expect(Login.index(ctx)).rejects.toThrow(HttpError);
    await expect(Login.index(ctx)).rejects.toMatchObject({ status: 400, message: "validation" });
  });
});
