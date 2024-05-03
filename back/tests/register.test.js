// const Register = require("../controllers/user/auth/signup");
// const password = require("../lib/password");
// const otp = require("../lib/otp");
// const sendEmail = require("../emailSender");
// const TokenManager = require("../lib/token");

// jest.mock("../lib/password");
// jest.mock("../lib/otp");
// jest.mock("../emailSender");
// jest.mock("../lib/token");

// describe("Register", () => {
//   describe("index", () => {
//     let ctx;

//     beforeEach(() => {
//       ctx = {
//         request: {
//           body: {
//             name: "newUser",
//             email: "newuser@example.com",
//             password: "password123",
//             remember: true,
//           },
//         },
//         db: {
//           User: {
//             findOne: jest.fn(),
//             create: jest.fn(),
//           },
//           UserPassword: {
//             create: jest.fn(),
//           },
//           UserControl: {
//             create: jest.fn(),
//           },
//           UserToken: {
//             create: jest.fn(),
//           },
//         },
//         config: {
//           jwt_secret: "secret",
//         },
//         response: {
//           body: {},
//         },
//       };

//       password.hash.mockResolvedValue("hashedPassword");
//       otp.generateOtp.mockReturnValue("123456");
//       TokenManager.mockImplementation(() => ({
//         generateAccess: () => ({ token: "accessToken", exp: "1d" }),
//         generateRefresh: () => ({
//           token: "refreshToken",
//           expired_at: new Date(),
//         }),
//       }));
//       sendEmail.mockResolvedValue(true);
//     });

//     it("should create a new user and return access and refresh tokens", async () => {
//       ctx.db.User.findOne.mockResolvedValue(null);
//       ctx.db.User.create.mockResolvedValue({
//         user_id: 1,
//         user_name: ctx.request.body.name,
//         user_email: ctx.request.body.email,
//       });

//       await Register(ctx);

//       expect(ctx.response.body).toHaveProperty("access_token", "accessToken");
//       expect(ctx.response.body).toHaveProperty("refresh_token", "refreshToken");
//       expect(ctx.response.body).toHaveProperty("email", "newuser@example.com");
//       expect(ctx.db.User.create).toHaveBeenCalledWith({
//         user_name: ctx.request.body.name,
//         user_email: ctx.request.body.email,
//       });
//     });

//     it("should handle errors when the user already exists", async () => {
//       ctx.db.User.findOne.mockResolvedValue({ user_id: 1 });

//       await expect(Register(ctx)).rejects.toThrow(
//         "Cette adresse mail existe déjà"
//       );

//       expect(ctx.db.User.create).not.toHaveBeenCalled();
//     });
//   });
// });
// dans un fichier nommé example.test.js
test("simple test", () => {
  expect(true).toBe(true);
});
