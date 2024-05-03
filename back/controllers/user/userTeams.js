import {
  request,
  summary,
  tags,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";
class UserTeam {
  @request("get", "/api/v1/user/teams")
  @summary("Récupère toutes les équipes de l'utilisateur")
  @tags(["User"])
  @middlewaresAll([auth])
  @responses({
    200: { description: "Liste des équipes récupérée avec succès" },
    404: { description: "Utilisateur n'appartient à aucune équipe" },
    500: { description: "Erreur interne du serveur" },
  })
  static async getUserTeams(ctx) {
    const userPermissions = await ctx.db.Permission.findAll({
      where: { perm_user: ctx.state.user.id },
      attributes: [],
      include: [
        {
          model: ctx.db.Team,
          as: "Team",
          attributes: ["team_id", "team_name"],
        },
      ],
    });

    if (!userPermissions.length) {
      ctx.status = 404;
      return (ctx.body = {
        message: "Aucune équipe trouvée pour cet utilisateur",
      });
    }

    // Map the results to get only the team information
    const teams = userPermissions.map((perm) => perm.Team);

    ctx.body = { teams };
  }
}

module.exports = UserTeam;
