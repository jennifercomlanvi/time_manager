import {
  request,
  summary,
  tags,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";

class UserProfile {
  @request("get", "/api/v1/user/profile")
  @summary("Récupère les informations de l'utilisateur connecté")
  @tags(["User"])
  @middlewaresAll([auth])
  @responses({
    200: {
      description: "Informations de l'utilisateur récupérées avec succès",
      schema: {
        type: "object",
        properties: {
          user_id: { type: "integer", example: 1 },
          user_name: { type: "string", example: "JohnDoe" },
          user_email: { type: "string", example: "john.doe@example.com" },
          user_uuid: { type: "string", example: "uuid-v4-example" },
          user_state: { type: "integer", example: 0 },
          user_description: {
            type: "string",
            example: "Une courte biographie de l'utilisateur.",
          },
          user_avatar: {
            type: "string",
          },
          user_last_visit: {
            type: "string",
          },
        },
      },
    },
    400: { description: "Requête invalide" },
    404: { description: "Utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const userId = ctx.state.user.id;

    try {
      const user = await ctx.db.User.findByPk(userId);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "Utilisateur non trouvé" };
        return;
      }
      // profil: user.toJSON()
      ctx.body = {
        name: user.user_name,
        email: user.user_email,
        avatar: user.user_avatar,
        uuid: user.user_uuid,
        description: user.user_description,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du profil utilisateur:",
        error
      );
      ctx.status = 500;
      ctx.body = { message: "Erreur interne du serveur" };
    }
  }
}

module.exports = UserProfile;
