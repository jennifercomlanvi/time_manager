import {
  request,
  summary,
  tags,
  responses,
  path,
  security,
} from "koa-swagger-decorator";

class All {
  @request("get", "/api/v1/projects/{id}")
  @summary("Récupère la liste des projets d'une équipe")
  @tags(["Projet"])
  @path({
    id: { type: "integer", description: "ID de l'équipe", required: true },
  })
  @security([{ BearerAuth: [] }])
  @responses({
    200: { description: "Liste des projets récupérée avec succès" },
    403: { description: "Accès refusé" },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async getProjects(ctx) {
    const teamId = parseInt(ctx.params.id);
    if (!teamId) {
      ctx.status = 400;
      ctx.body = { error: "ID d'équipe invalide" };
      return;
    }

    const projects = await ctx.db.Project.findAll({
      where: { project_team: teamId },
    });

    if (!projects) {
      ctx.status = 404;
      ctx.body = { error: "Aucun projet trouvé pour cette équipe" };
      return;
    }

    const formattedProjects = projects.map((project) => ({
      name: project.project_name,
      description: project.project_description,
      deadline: project.project_deadline
        ? project.project_deadline.toISOString().substring(0, 10)
        : null,
    }));

    ctx.status = 200;
    ctx.body = {
      projects: formattedProjects,
    };
  }
}

module.exports = All.getProjects;
