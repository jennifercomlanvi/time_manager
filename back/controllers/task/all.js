import HttpError from "../../lib/HttpError";
import { request, summary, tags, responses, query } from "koa-swagger-decorator";

class All {
  @request("get", "/api/v1/projects/{projectId}/tasks")
  @summary("Récupère la liste de toutes les tâches associées à un projet")
  @tags(["Tâche"])
  @query({
    projectId: { type: 'number', description: 'ID du projet', required: true }
  })
  @responses({
    200: { description: "Liste des tâches récupérée avec succès" },
    403: { description: "Accès refusé" },
    404: { description: "Projet non trouvé" }
  })
  static async getTasksByProject(ctx) {
    const { projectId } = ctx.params;
    try {
      const project = await ctx.db.Project.findByPk(projectId);
      if (!project) {
        ctx.status = 404;
        ctx.body = { error: "Projet non trouvé" };
        return;
      }

      const tasks = await ctx.db.Task.findAll({
        where: { task_project: projectId }
      });
      
      ctx.status = 200;
      ctx.body = { tasks };
    } catch (error) {
      throw new HttpError(500, "Erreur interne du serveur");
    }
  }
}

module.exports = All.getTasksByProject;
