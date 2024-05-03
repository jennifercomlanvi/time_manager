const Form = require("../../../lib/validation/form");
const HttpError = require("../../../lib/HttpError");
const rules = require("../../../lib/validation/rules");
const TokenManager = require("../../../lib/token");
import {
  request,
  summary,
  query,
  tags,
  responses,
} from "koa-swagger-decorator";

class Refresh {
  @request("post", "/api/v1/refresh")
  @summary("Rafraîchir le token d’accès")
  @tags(["Authentification"])
  @query({
    token: {
      type: "string",
      required: true,
      description: "Refresh token nécessaire pour rafraîchir le token d’accès",
    },
  })
  @responses({
    200: {
      description: "Token d’accès et de rafraîchissement générés avec succès",
    },
    400: { description: "Erreur de validation" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("token", (value) => {
      rules.required(value, "Un refresh_token valide est requis");
      rules.equalLen(value, 36, "Un refresh_token valide est requis");
    });
    if (!form.validate(ctx.request.query)) {
      throw new HttpError(400, "validation", form.errors());
    }

    const userToken = await ctx.db.UserToken.findOne({
      where: { token: form.value("token") },
    });

    if (!userToken) {
      form.setError("token", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    const user = await userToken.getUser();

    const userControlExists = await ctx.db.UserControl.findOne({
      where: { control_user: user.user_id },
    });

    const tokenManager = new TokenManager(ctx.config.jwt_secret);

    const accessToken = tokenManager.generateAccess(user.user_id);
    const refresh = tokenManager.generateRefresh(user.user_id);

    await ctx.db.UserToken.create({
      user_id: user.user_id,
      token: refresh.token,
      expired_at: refresh.expired_at,
    });

    ctx.response.body = {
      uuid: user.user_uuid,
      name: user.user_name,
      email: user.user_email,
      token: accessToken.token,
      expire_in: accessToken.exp,
      refresh_token: refresh.token,
      has_control: !!userControlExists,
    };
  }
}

module.exports = Refresh;
