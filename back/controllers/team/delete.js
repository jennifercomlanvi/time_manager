import { request, summary, tags, path, responses } from "koa-swagger-decorator";

class Delete {
  @request("delete", "/api/v1/team/:id")
  @summary("Supprime une équipe spécifique")
  @tags(["Équipe"])
  @path({
    id: {
      type: "number",
      required: true,
      description: "ID de l'équipe à supprimer",
    },
  })
  @responses({
    200: { description: "Équipe supprimée avec succès" },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async deleteTeam(ctx) {
    const teamId = ctx.params.id;

    try {
      const team = await ctx.db.Team.findByPk(teamId);
      if (!team) {
        ctx.status = 204;
      }

      await team.destroy();
      ctx.status = 204;
      ctx.body = { message: "Équipe supprimée avec succès" };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, "Erreur interne du serveur");
    }
  }
}

export default Delete.deleteTeam;
