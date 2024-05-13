import {
  request,
  summary,
  tags,
  body,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import HttpError from "../../../lib/HttpError";
import auth from "../../../middleware/auth";
import permissions from "../../../middleware/permissions";

class RemovePermission {
  @request("delete", "/api/v1/permissions")
  @summary("Supprime une permission d'un utilisateur")
  @tags(["Permission"])
  @middlewaresAll([auth, permissions])
  @body({
    team: { type: "number", required: true, description: "ID de l'équipe" },
    userId: {
      type: "number",
      required: true,
      description: "ID de l'utilisateur",
    },
  })
  @responses({
    200: { description: "Permission supprimée avec succès" },
    400: { description: "Erreur de validation ou suppression non autorisée" },
    404: { description: "Permission ou utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const { team, userId } = ctx.request.body;

    const permission = await ctx.db.Permission.findOne({
      where: {
        perm_user: userId,
        perm_team: team,
      },
    });

    if (!permission) {
      throw new HttpError(404, "not_found", "Permission non trouvée");
    }

    if (permission.perm_level === ctx.db.Permission.LEVELS.ADMIN) {
      const adminCount = await ctx.db.Permission.count({
        where: {
          perm_team: team,
          perm_level: ctx.db.Permission.LEVELS.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new HttpError(
          400,
          "last_admin",
          "Impossible de supprimer le dernier administrateur de l'équipe"
        );
      }
    }

    await permission.destroy();

    ctx.status = 200;
    ctx.body = { message: "Permission supprimée avec succès" };
  }
}

module.exports = RemovePermission;
