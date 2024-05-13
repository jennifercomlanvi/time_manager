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

class UpdatePermission {
  @request("put", "/api/v1/permissions/{id}")
  @summary("Modifie le niveau de permission d'un utilisateur")
  @tags(["Permission"])
  @middlewaresAll([auth, permissions])
  @body({
    level: {
      type: "number",
      required: true,
      description: "Nouveau niveau de la permission",
    },
  })
  @responses({
    200: { description: "Permission modifiée avec succès" },
    400: { description: "Modification non autorisée ou impossible" },
    404: { description: "Permission non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const { id } = ctx.params; // ID de la permission
    const { level } = ctx.request.body;

    const permission = await ctx.db.Permission.findByPk(id);

    if (!permission) {
      throw new HttpError(404, "not_found", "Permission non trouvée");
    }

    // Vérification spécifique si on veut changer un admin en contributeur
    if (
      permission.perm_level === ctx.db.Permission.LEVELS.ADMIN &&
      level === ctx.db.Permission.LEVELS.CONTRIBUTOR
    ) {
      const adminCount = await ctx.db.Permission.count({
        where: {
          perm_team: permission.perm_team,
          perm_level: ctx.db.Permission.LEVELS.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new HttpError(
          400,
          "last_admin",
          "Impossible de changer le niveau du dernier administrateur"
        );
      }
    }

    // Mise à jour de la permission
    permission.perm_level = level;
    await permission.save();

    ctx.status = 200;
    ctx.body = { message: "Permission modifiée avec succès", permission };
  }
}

module.exports = UpdatePermission;
