const Form = require("../../../lib/validation/form");
const HttpError = require("../../../lib/HttpError");
const rules = require("../../../lib/validation/rules");
const TokenManager = require("../../../lib/token");
import {
  request,
  summary,
  body,
  tags,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../../middleware/auth";

class Renew {
  @request("get", "/api/v1/renew")
  @summary(
    "Renouveler l'accès et actualiser les jetons pour les utilisateurs authentifiés"
  )
  @tags(["Authentification"])
  @middlewaresAll([auth])
  @body({
    token: {
      type: "string",
      description: "Existing refresh token to be renewed, if valid",
    },
  })
  @responses({
    200: { description: "Tokens successfully renewed" },
    400: { description: "Invalid or expired refresh token" },
    401: { description: "Unauthorized" },
    404: { description: "User not found" },
    500: { description: "Internal server error" },
  })
  static async index(ctx) {
    if (!ctx.state.user.id) {
      throw new HttpError(401, "authentication", "User not authenticated");
    }

    const form = new Form();
    form.stringField("token", (value) => {
      if (value) {
        rules.required(value, "Un refresh_token valide est requis");
        rules.equalLen(value, 36, "Un refresh_token valide est requis");
      }
    });

    let user = await ctx.db.User.findOne({
      where: { user_id: ctx.state.user.id },
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    let userControlExists = await ctx.db.UserControl.findOne({
      where: { control_user: user.user_id },
    });

    if (!form.validate(ctx.request.query)) {
      throw new HttpError(400, "validation", form.errors());
    }

    const tokenManager = new TokenManager(ctx.config.jwt_secret);
    const accessToken = tokenManager.generateAccess(user.user_id);
    // Vérifier le refresh token s'il est fourni
    if (form.value("token")) {
      const refreshToken = await ctx.db.UserToken.findOne({
        where: { token: form.value("token"), user_id: user.user_id },
      });

      if (!refreshToken || refreshToken.expired_at < new Date()) {
        throw new HttpError(400, "Invalid or expired refresh token");
      }

      // Régénérer le refresh token
      const newRefreshToken = tokenManager.resetRefresh(user.user_id);
      await refreshToken.update({
        token: newRefreshToken.token,
        expired_at: newRefreshToken.expired_at,
      });

      ctx.body = {
        access_token: accessToken.token,
        refresh_token: newRefreshToken.token,
        expire_in: accessToken.exp,
        refresh_in: Math.floor(
          new Date(newRefreshToken.expired_at).getTime() / 1000
        ),
        uuid: user.user_uuid,
        name: user.user_name,
        email: user.user_email,
        has_control: !!userControlExists,
      };
    } else {
      ctx.body = {
        access_token: accessToken.token,
        expire_in: accessToken.exp,
        uuid: user.user_uuid,
        name: user.user_name,
        email: user.user_email,
        has_control: !!userControlExists,
      };
    }
  }
}
module.exports = Renew;
