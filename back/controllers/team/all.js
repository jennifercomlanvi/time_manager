const {
  request,
  summary,
  tags,
  middlewares,
  responses,
} = require("koa-swagger-decorator");
class All {
  @request("get", "/api/v1/teams")
  @summary("Récupère la liste de toutes les équipes")
  @tags(["Équipe"])
  @responses({
    200: { description: "Liste des équipes récupérée avec succès" },
    403: { description: "Accès refusé" },
  })
  static async index(ctx) {
    try {
      const teams = await ctx.db.Team.findAll();
      ctx.body = { teams };
    } catch (error) {
      throw new HttpError(500, "Erreur interne du serveur");
    }
  }
}
module.exports = All.index;
