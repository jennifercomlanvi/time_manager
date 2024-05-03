import Form from "../../../lib/validation/form";
import HttpError from "../../../lib/HttpError";
import { required as _required, isEmail } from "../../../lib/validation/rules";
import { compare } from "../../../lib/password";
const TokenManager = require("../../../lib/token");
import { request, summary, body, tags, responses } from "koa-swagger-decorator";
class Login {
  @request("post", "/api/v1/signin")
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
      _required(value, "Un email valide est requis");
      isEmail(value, "Un email valide est requis");
    });
    form.stringField("password", (value) => {
      _required(value, "Un mot de passe valide est requis");
    });
    form.booleanField("remember", (value) => {
      _required(value, "Le champ 'remember' doit être un booléen");
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

    if (!compare(form.value("password"), userPassord.value)) {
      form.setError("email", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    const userControlExists = await ctx.db.UserControl.findOne({
      where: { control_user: user.user_id },
    });

    const tokenManager = new TokenManager(ctx.config.jwt_secret);
    const accessToken = tokenManager.generateAccess(user.user_id);

    let refresh = null;
    if (form.value("remember")) {
      const refreshToken = tokenManager.generateRefresh(user.user_id);
      refresh = await ctx.db.UserToken.create({
        user_id: user.user_id,
        token: refreshToken.token,
        expired_at: refreshToken.expired_at,
      });
    }
    ctx.response.body = {
      name: user.user_name,
      uuid: user.user_uuid,
      email: user.user_email,
      access_token: accessToken.token,
      expire_in: accessToken.exp,
      refresh_token: refresh ? refresh.token : null,
      refresh_in: refresh
        ? Math.floor(new Date(refresh.expired_at).getTime() / 1000)
        : null,
      has_control: !!userControlExists,
    };
  }
}

module.exports = Login;
