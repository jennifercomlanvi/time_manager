import Register from "../controllers/user/auth/signup";
import HttpError from "../lib/HttpError";
import password from  "../lib/password";
import otp from "../lib/otp";
import TokenManager from "../lib/token";

jest.mock("../lib/password");
jest.mock("../lib/otp");
jest.mock("../lib/token");

describe("Register", () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      request: {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          remember: true,
        },
      },
      db: {
        User: {
          findOne: jest.fn(),
          create: jest.fn(),
        },
        UserPassword: {
          create: jest.fn(),
        },
        UserControl: {
          create: jest.fn(),
          CTRL_REGISTER: "register",
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

    otp.generateOtp.mockReturnValue("123456");
    password.hash.mockResolvedValue("hashedpassword");
    TokenManager.mockImplementation(() => ({
      generateAccess: jest.fn().mockReturnValue({ token: "accessToken", exp: 3600 }),
      generateRefresh: jest.fn().mockReturnValue({ token: "refreshToken", expired_at: new Date() }),
    }));
  });

  it("should register a new user successfully", async () => {
    ctx.db.User.findOne.mockResolvedValue(null);
    ctx.db.User.create.mockResolvedValue({ user_id: 1, user_name: "Test User", user_email: "test@example.com", user_uuid: "uuid" });
    ctx.db.UserPassword.create.mockResolvedValue({});
    ctx.db.UserControl.create.mockResolvedValue({});
    ctx.db.UserToken.create.mockResolvedValue({ token: "refreshToken", expired_at: new Date() });

    await Register.index(ctx);

    expect(ctx.db.User.findOne).toHaveBeenCalledWith({ where: { user_email: "test@example.com" } });
    expect(ctx.db.User.create).toHaveBeenCalledWith({ user_name: "Test User", user_email: "test@example.com" });
    expect(ctx.db.UserPassword.create).toHaveBeenCalledWith({ user_id: 1, value: "hashedpassword" });
    expect(ctx.db.UserControl.create).toHaveBeenCalledWith({ control_user: 1, control_type: "register", control_otp: "123456" });
    expect(ctx.db.UserToken.create).toHaveBeenCalledWith({ user_id: 1, token: "refreshToken", expired_at: expect.any(Date) });

    expect(ctx.response.body).toEqual({
      uuid: "uuid",
      name: "Test User",
      email: "test@example.com",
      access_token: "accessToken",
      expire_in: 3600,
      refresh_token: "refreshToken",
      refresh_in: expect.any(Number),
      has_control: true,
    });
  });

  it("should return 400 if email already exists", async () => {
    ctx.db.User.findOne.mockResolvedValue({ user_email: "test@example.com" });

    await expect(Register.index(ctx)).rejects.toThrow(HttpError);
    await expect(Register.index(ctx)).rejects.toMatchObject({ status: 400, message: "validation" });

    expect(ctx.db.User.findOne).toHaveBeenCalledWith({ where: { user_email: "test@example.com" } });
  });

  it("should return 400 for invalid form data", async () => {
    ctx.request.body.email = "";

    await expect(Register.index(ctx)).rejects.toThrow(HttpError);
    await expect(Register.index(ctx)).rejects.toMatchObject({ status: 400, message: "validation" });
  });
});
