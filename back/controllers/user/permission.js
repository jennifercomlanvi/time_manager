const {
  request,
  summary,
  tags,
  responses,
} = require("koa-swagger-decorator");
class Permission {
  @request("get", "/api/v1/teams/user")
  @summary("Récupère les équipes de l'utilisateur connecté")
  @tags(["Utilisateurs"])
  @responses({
    200: { description: "Équipe créée avec succès" },
    400: { description: "Requête invalide" },
    404: { description: "Utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })

static async getUserTeams(ctx) {
    const userId = ctx.state.user.id; 

    try {
      const permissions = await Permission.findAll({
        where: { perm_user: userId },
        include: [{
          model: ctx.db.Team,
          as: 'team_permissions'
        }]
      });

      if (!permissions.length) {
        return ctx.body = { message: "Aucune équipe trouvée pour cet utilisateur." };
      }

      const teams = permissions.map(permission => permission.team_permissions);

      ctx.body = { teams };
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes :', error);
      ctx.status = 500;
      ctx.body = { message: "Erreur interne du serveur" };
    }
  }
}

module.exports = Permission.getUserTeams;
