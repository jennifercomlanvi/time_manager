import { request, summary, tags, responses } from "koa-swagger-decorator";

class ProjectAdmin {
  @request("get", "/api/v1/user/projects/admin")
  @summary(
    "Récupère les projets des équipes dont l'utilisateur est administrateur"
  )
  @tags(["Projet"])
  @responses({
    200: { description: "Projets récupérés avec succès" },
    404: {
      description:
        "Aucun projet trouvé pour cet utilisateur en tant qu'administrateur",
    },
  })
  static async index(ctx) {
    const userId = ctx.state.user.id;
    const ADMIN_LEVEL = 1;

    // Récupérer uniquement les permissions d'administrateur de l'utilisateur
    const adminPermissions = await ctx.db.Permission.findAll({
      where: { perm_user: userId, perm_level: ADMIN_LEVEL },
      include: [{ model: ctx.db.Team, as: "Team" }],
    });

    if (adminPermissions.length === 0) {
      ctx.status = 404;
      return;
    }

    const projectsByTeam = [];

    for (const permission of adminPermissions) {
      const teamName = permission.Team.team_name;

      // Trouver l'objet de l'équipe existant ou créer un nouveau si ce n'existe pas
      let team = projectsByTeam.find((team) => team.label === teamName);
      if (!team) {
        team = {
          label: teamName,
          items: [],
        };
        projectsByTeam.push(team);
      }

      // Récupérer les projets de cette équipe
      const teamProjects = await ctx.db.Project.findAll({
        where: { project_team: permission.perm_team },
      });

      // Ajouter les projets au tableau 'items' de l'équipe
      team.items.push(
        ...teamProjects.map((project) => ({
          id: project.project_id,
          name: project.project_name,
        }))
      );
    }

    ctx.body = projectsByTeam;
  }
}

module.exports = ProjectAdmin;
