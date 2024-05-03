import HttpError from "../../lib/HttpError";
import {
  request,
  summary,
  tags,
  responses,
  path,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";
class TasksByProject {
  @request("get", "/api/v1/project/{id}/tasks")
  @summary("Récupère la liste de toutes les tâches associées à un projet")
  @tags(["Task"])
  @middlewaresAll([auth])
  @path({
    id: { type: "number", description: "ID du projet", required: true },
  })
  @responses({
    200: { description: "Liste des tâches récupérée avec succès" },
    403: { description: "Accès refusé" },
    404: { description: "Projet non trouvé" },
  })
  static async index(ctx) {
    console.log("dghj", ctx.params);
    const { id } = ctx.params;
    try {
      const project = await ctx.db.Project.findByPk(id);
      if (!project) {
        ctx.status = 404;
        return;
      }

      const tasks = await ctx.db.Task.findAll({
        where: { task_project: id },
      });
      if (!tasks) {
        ctx.status = 404;
        return;
      }

      const formattedTasks = tasks.map((task) => ({
        name: task.task_name,
        description: task.task_description,
        state: task.task_state,
      }));

      ctx.status = 200;
      ctx.body = { tasks: formattedTasks };
    } catch (error) {
      throw new HttpError(500, "Erreur interne du serveur");
    }
  }
}

module.exports = TasksByProject;
