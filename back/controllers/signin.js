const Form = require("../lib/validation/form.js");
const HttpError = require("../lib/HttpError.js");
const rules = require("../lib/validation/rules.js");
const password = require("../lib/password.js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { DateTime } = require("luxon");
const {
  request,
  summary,
  body,
  tags,
  responses,
} = require("koa-swagger-decorator");
class LoginController {
  @request("post", "/api/v1/login")
  @summary("Connexion utilisateur")
  @tags(["Authentification"])
  @body({
    email: {
      type: "string",
      required: true,
      description: "Adresse email de l'utilisateur",
    },
    password: {
      type: "string",
      required: true,
      description: "Mot de passe de l'utilisateur",
    },
  })
  @responses({
    200: { description: "Connexion réussie" },
    400: { description: "Données de requête invalides" },
  })

  static async index(ctx) {
    const form = new Form();
    form.stringField("email", (value) => {
      rules.required(value, "Un email valide est requis");
      rules.isEmail(value, "Un email valide est requis");
    });
    form.stringField("password", (value) => {
      rules.required(value, "Un mot de passe valide est requis");
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "validation", form.errors());
    }

    const user = await ctx.db.User.findOne({
      where: { user_email: form.value("email") },
    });

    if (!user) {
      form.setError("email", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    const userPassord = await user.getUserPassword();

    if (!userPassord) {
      form.setError("email", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    if (!password.compare(form.value("password"), userPassord.value)) {
      form.setError("email", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

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
  }
}

module.exports = LoginController.index;
