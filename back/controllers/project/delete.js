import {
  request,
  summary,
  tags,
  path,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";
class DeleteProject {
  @request("delete", "/api/v1/project/{id}")
  @summary("Supprime un projet spécifique")
  @tags(["Project"])
  @middlewaresAll([auth])
  @path({
    id: {
      type: "number",
      required: true,
      description: "ID du projet à supprimer",
    },
  })
  @responses({
    200: { description: "Projet supprimé avec succès" },
    404: { description: "Projet non trouvé" },
    403: { description: "Non autorisé à supprimer ce projet" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const projectId = ctx.params.id;
    const project = await ctx.db.Project.findByPk(projectId);
    if (!project) {
      ctx.status = 204;
      return;
    }
    const permission = await ctx.db.Permission.findOne({
      where: {
        perm_user: ctx.state.user.id,
        perm_team: project.project_team,
        perm_level: ctx.db.Permission.LEVELS.ADMIN,
      },
    });

    if (!permission) {
      ctx.status = 403;
      ctx.body = { error: "Non autorisé à supprimer ce projet" };
      return;
    }

    await project.destroy();
    ctx.status = 204;
  }
}

module.exports = DeleteProject;
