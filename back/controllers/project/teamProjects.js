import {
  request,
  summary,
  tags,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";
class TeamProject {
  @request("get", "/api/v1/user/projects")
  @summary("Récupère les projets de l'utilisateur et les groupe par équipe")
  @tags(["Project"])
  @middlewaresAll([auth])
  @responses({
    200: { description: "Projets récupérés avec succès" },
    404: { description: "Aucun projet trouvé pour cet utilisateur" },
  })
  static async index(ctx) {
    const userId = ctx.state.user.id;

    // Récupérer les équipes de l'utilisateur à partir de la table de permissions
    const userPermissions = await ctx.db.Permission.findAll({
      where: { perm_user: userId },
      include: [{ model: ctx.db.Team, as: "Team" }],
    });

    // Si aucun utilisateur n'est trouvé dans les permissions, renvoyer une réponse 404
    if (userPermissions.length === 0) {
      ctx.status = 404;
      return (ctx.body = {
        message: "Aucune équipe trouvée pour cet utilisateur",
      });
    }

    // Initialiser un objet pour stocker les projets regroupés par équipe
    const projectsByTeam = {};

    // Pour chaque équipe auxquelles l'utilisateur a accès, récupérer les projets associés
    for (const permission of userPermissions) {
      const teamName = permission.Team.team_name;

      if (!projectsByTeam[teamName]) {
        projectsByTeam[teamName] = [];
      }

      // Récupérer les projets de l'équipe actuelle
      const teamProjects = await ctx.db.Project.findAll({
        where: { project_team: permission.perm_team },
      });

      // Ajouter les projets de l'équipe à la liste des projets regroupés
      projectsByTeam[teamName].push(
        ...teamProjects.map((project) => ({
          id: project.project_id,
          name: project.project_name,
          description: project.project_description,
          deadline: project.project_deadline,
        }))
      );
    }

    // Renvoyer la liste des projets regroupés par équipe
    ctx.body = projectsByTeam;
  }
}

module.exports = TeamProject;
