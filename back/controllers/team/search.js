const {
  request,
  summary,
  path,
  tags,
  responses,
} = require("koa-swagger-decorator");

class Team {
  @request("get", "/api/v1/teams/:teamId/users")
  @summary(
    "Récupère les utilisateurs d'une équipe spécifique et leurs permissions"
  )
  @tags(["Équipe"])
  @path({
    teamId: { type: "number", required: true, description: "ID de l'équipe" },
  })
  @responses({
    200: { description: "Utilisateurs récupérés avec succès" },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async getTeamUsersWithPermissions(ctx) {
    const teamId = ctx.params.id;

    try {
      const teamWithUsers = await Team.findByPk(teamId, {
        include: [
          {
            model: User,
            as: "users",
            attributes: ["user_id", "user_name", "user_email"],
            through: {
              model: Permission,
              as: "permissions",
              attributes: ["level"],
            },
          },
        ],
      });

      if (!teamWithUsers) {
        ctx.status = 404;
        return (ctx.body = { message: "Équipe non trouvée" });
      }

      ctx.body = {
        teamId: teamWithUsers.id,
        users: teamWithUsers.users.map((user) => ({
          id: user.user_id,
          name: user.user_name,
          email: user.user_email,
          uuid: user.user_uuid,
          permissions: user.permissions,
        })),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs de l'équipe:",
        error
      );
      ctx.status = 500;
      ctx.body = { message: "Erreur interne du serveur" };
    }
  }
}

module.exports = Team.getTeamUsersWithPermissions;
