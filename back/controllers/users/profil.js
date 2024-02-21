const { request, summary, tags, responses } = require("koa-swagger-decorator");
const { User } = require("../models");

class User {
  @request("get", "/api/v1/user/profile")
  @summary("Récupère les informations de l'utilisateur connecté")
  @tags(["Utilisateurs"])
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
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          user_last_visit: {
            type: "string",
            example: "2020-01-01T00:00:00.000Z",
          },
        },
      },
    },
    400: { description: "Requête invalide" },
    404: { description: "Utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async getUserProfile(ctx) {
    const userId = ctx.state.user.id;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "Utilisateur non trouvé" };
        return;
      }

      ctx.body = { user: user.toJSON() };
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

module.exports = User.getUserProfile;
