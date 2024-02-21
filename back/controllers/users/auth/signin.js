import Form from "../../../lib/validation/form";
import HttpError from "../../../lib/HttpError";
import { required as _required, isEmail } from "../../../lib/validation/rules";
import { compare } from "../../../lib/password";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
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

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;

    const token = sign(
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

module.exports = Login.index;
