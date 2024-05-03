const HttpError = require("../../../lib/HttpError");
const { request, summary, tags, responses } = require("koa-swagger-decorator");

class UserControl {
  @request("get", "/api/v1/user/control")
  @summary("Récupère le UserControl le plus ancien pour un utilisateur")
  @tags(["UserControl"])
  @responses({
    200: { description: "UserControl récupéré avec succès" },
    404: { description: "Utilisateur ou UserControl non trouvé" },
  })
  static async index(ctx) {
    const userId = ctx.state.user.id;
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
      ctx.response.body = {
        user: userControl.control_user,
        type: userControl.control_type,
        data: userControl.control_data,
        created_at: userControl.createdAt,
        expired_at: userControl.control_expired_at,
      };
    } catch (err) {
      throw new HttpError(500, "Erreur serveur", { detail: err.message });
    }
  }
}

module.exports = UserControl;
