const {
  request,
  summary,
  tags,
  responses,
} = require("koa-swagger-decorator");

class Team {
  @request("get", "/api/v1/teams/user")
  @summary(
    "Récupère les utilisateurs d'une équipe spécifique et leurs permissions"
  )
  @tags(["Équipe"])
  @responses({
    200: { description: "Utilisateurs récupérés avec succès" },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async getTeamUsersWithPermissions(ctx) {
    const userWithTeams = await ctx.db.User.findByPk(ctx.state.user.id, {
      attributes: ['user_id'],
      include: [{
        model: ctx.db.Team,
        as: 'Teams',
        attributes: ['team_id','team_name','team_description'],
        include: [{
          model: ctx.db.User,
          as: 'Users',
          attributes: ['user_id', 'user_name', 'user_email'],
        }]
      }]
    });

      if (!userWithTeams) {
        ctx.status = 404;
        return (ctx.body = { message: "Aucune équipe trouvée pour cet utilisateur" });
      }
      const formattedTeams = userWithTeams.Teams.map(team => ({
        team_id: team.team_id,
        team_name: team.team_name,
        team_description: team.team_description,
        Users: team.Users.map(user => ({
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            permission: user.Permission.perm_level
        }))
    }));
      ctx.body = {
        user:userWithTeams.user_id,
        teams : formattedTeams
      };
  }
}
module.exports = Team.getTeamUsersWithPermissions;
