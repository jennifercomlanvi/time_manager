const {
  request,
  summary,
  tags,
  responses,
  middlewaresAll,
} = require("koa-swagger-decorator");
import auth from "../../middleware/auth";

class UserAdminTeams {
  @request("get", "/api/v1/user/teams/admin")
  @summary("Récupère les équipes où l'utilisateur est admin")
  @tags(["User"])
  @middlewaresAll([auth])
  @responses({
    200: { description: "Équipes administrées récupérées avec succès" },
    404: { description: "Aucune équipe d'administration trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const adminTeams = await ctx.db.Team.findAll({
      include: [
        {
          model: ctx.db.Permission,
          as: "Permissions",
          where: {
            perm_user: ctx.state.user.id,
            perm_level: ctx.db.Permission.LEVELS.ADMIN,
          },
          attributes: [],
        },
      ],
      attributes: ["team_id", "team_name"],
    });

    if (adminTeams.length === 0) {
      ctx.status = 404;
      return (ctx.body = {
        message: "Aucune équipe d'administration trouvée pour cet utilisateur",
      });
    }

    ctx.body = adminTeams.map((team) => ({
      id: team.team_id,
      name: team.team_name,
    }));
  }
}

module.exports = UserAdminTeams;
