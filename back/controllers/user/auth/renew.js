// const Form = require("../../../lib/validation/form");
// const HttpError = require("../../../lib/HttpError");
// const rules = require("../../../lib/validation/rules");
// const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");
// const { DateTime } = require("luxon");

// class TokenManager {
//   constructor(user) {
//     this.user = user;
//   }

//   generateAccess() {
//     const now = Math.floor(Date.now() / 1000);
//     const exp = now + 3600;
//     return jwt.sign(
//       { sub: this.user.user_id, iat: now, exp },
//       process.env.JWT_SECRET
//     );
//   }

//   resetRefresh(refreshToken) {
//     const newRefreshToken = uuidv4();
//     refreshToken.token = newRefreshToken;
//     refreshToken.expired_at = DateTime.now().plus({ hours: 24 }).toJSDate();
//     refreshToken.save();
//     return { refreshToken: newRefreshToken };
//   }
// }

// const index = async (ctx, next) => {
//   // Assurer que l'utilisateur est authentifié
//   if (!ctx.state.user) {
//     throw new HttpError(401, "authentication", "User not authenticated");
//   }

//   const form = new Form();
//   form.stringField("token", (value) => {
//     rules.required(value, "Un refresh_token valide est requis");
//     rules.equalLen(value, 36, "Un refresh_token valide est requis");
//   });

//   if (!form.validate(ctx.request.query)) {
//     throw new HttpError(400, "validation", form.errors());
//   }

//   const refreshToken = await ctx.db.UserToken.findOne({
//     where: { token: form.value("token") },
//   });

//   if (!refreshToken) {
//     throw new HttpError(400, "Invalid token", {
//       token: "Invalid or expired refresh token",
//     });
//   }

//   const user = await ctx.db.User.findOne({
//     where: { user_id: ctx.state.user.user_id },
//   });
//   const tokenManager = new TokenManager(user);
//   const accessToken = tokenManager.generateAccess();

//   const tokenUpdates = refreshToken
//     ? tokenManager.resetRefresh(refreshToken)
//     : {};

//   ctx.body = {
//     accessToken,
//     ...tokenUpdates,
//     uuid: user.user_uuid,
//     name: user.user_name,
//     email: user.user_email,
//     has_control: !!user.has_control,
//   };
// };

// module.exports = index;
