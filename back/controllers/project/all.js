import HttpError from "../../lib/HttpError";
import { request, summary, tags, responses, query, security } from "koa-swagger-decorator";

class All {
  @request("get", "/api/v1/user/{uuid}/projects")
  @summary("Récupère la liste des projets sur lesquels un utilisateur a des permissions")
  @tags(["Projet"])
  @query({
    uuid: { type: 'string', description: 'UUID de l\'utilisateur', required: true }
  })
  @security([{ BearerAuth: [] }])
  @responses({
    200: { description: "Liste des projets récupérée avec succès" },
    403: { description: "Accès refusé" },
    404: { description: "Utilisateur non trouvé" }
  })
  static async getUserProjects(ctx) {
    const { uuid } = ctx.request.query;
    try {
      // Trouver l'utilisateur par UUID
      const user = await ctx.db.User.findOne({
        where: { user_uuid: uuid },
        include: [{
          model: ctx.db.Team,
          include: [{
            model: ctx.db.Project
          }]
        }]
      });

      if (!user) {
        ctx.status = 404;
        ctx.body = { error: "Utilisateur non trouvé" };
        return;
      }

      // Extraire les projets des équipes auxquelles l'utilisateur appartient
      let projects = [];
      user.Teams.forEach(team => {
        projects = [...projects, ...team.Projects];
      });

      ctx.status = 200;
      ctx.body = { projects };
    } catch (error) {
      throw new HttpError(500, error.message || "Erreur interne du serveur");
    }
  }
}

module.exports = All.getUserProjects;
