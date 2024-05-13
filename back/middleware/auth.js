const jwt = require("jsonwebtoken");
const HttpError = require("../lib/HttpError");

function getToken(ctx) {
  if (!ctx.request.headers.authorization) {
    return null;
  }

  const auth = ctx.request.headers.authorization.split(" ");

  if (auth.length < 2 || auth[0] !== "Bearer") {
    return null;
  }

  return auth[1];
}

module.exports = async (ctx, next) => {
  const token = getToken(ctx);
  if (!token) {
    throw new HttpError(401, "Token required");
  }

  try {
    ctx.request.jwtPayload = jwt.verify(token, ctx.config.jwt_secret);
    ctx.state.user = {
      id: ctx.request.jwtPayload.sub,
    };
  } catch (err) {
    throw new HttpError(401, err.message);
  }

  await next();
};
