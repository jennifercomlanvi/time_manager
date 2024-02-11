const Form = require("../lib/validation/form");
const HttpError = require("../lib/HttpError");
const rules = require("../lib/validation/rules");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { DateTime } = require("luxon");

const index = async (ctx, next) => {
  const form = new Form();
  form.stringField("refresh_token", (value) => {
    rules.required(value, "Un refresh_token valide est requis");
    rules.equalLen(value, 36, "Un refresh_token valide est requis");
  });

  if (!form.validate(ctx.request.body)) {
    throw new HttpError(400, "validation", form.errors());
  }

  const userToken = await ctx.db.UserToken.findOne({
    where: { refresh_token: form.value("refresh_token") },
  });

  if (!userToken) {
    form.setError("refresh_token", "bad");
    throw new HttpError(400, "validation", form.errors());
  }

  const user = await userToken.getUser();

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const token = jwt.sign(
    {
      sub: user.user_id,
      iat: now,
      exp: exp,
    },
    ctx.config.jwt_secret
  );

  const refresh_token = uuidv4();

  await ctx.db.UserToken.create({
    user_id: user.user_id,
    token: refresh_token,
    expired_at: DateTime.now().plus({ hours: 24 }).toJSDate(),
  });

  ctx.response.body = {
    username: user.user_name,
    token: token,
    expire_in: exp,
    refresh_token: refresh_token,
  };
};

module.exports = index;
