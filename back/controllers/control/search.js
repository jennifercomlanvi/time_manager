const HttpError = require("../../lib/HttpError");
const {
  request,
  summary,
  tags,
  path,
  responses,
} = require("koa-swagger-decorator");

class UserControlController {
  @request("get", "/api/v1/user/{userId}/control")
  @summary("Récupère le UserControl le plus ancien pour un utilisateur")
  @tags(["UserControl"])
  @path({
    userId: {
      type: "string",
      required: true,
      description: "ID de l'utilisateur",
    },
  })
  @responses({
    200: { description: "UserControl récupéré avec succès" },
    404: { description: "Utilisateur ou UserControl non trouvé" },
  })
  static async getUserControl(ctx) {
    const userId = ctx.params.userId;
    try {
      const userControl = await ctx.db.UserControl.findOne({
        where: { control_user: userId },
        order: [["created_at", "ASC"]],
      });

      if (!userControl) {
        throw new HttpError(
          404,
          "Aucun UserControl trouvé pour cet utilisateur"
        );
      }

      ctx.response.status = 200;
      ctx.response.body = { userControl: userControl };
    } catch (err) {
      throw new HttpError(500, "Erreur serveur", { detail: err.message });
    }
  }
}

module.exports = UserControlController.getUserControl;
