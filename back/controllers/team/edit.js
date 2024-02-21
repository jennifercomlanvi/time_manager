const Form = require("../../lib/validation/form");
const rules = require("../../lib/validation/rules");
const HttpError = require("../../lib/HttpError");

const {
  request,
  summary,
  tags,
  body,
  responses,
  path,
} = require("koa-swagger-decorator");

class Edit {
  @request("put", "/api/v1/team/:id")
  @summary("Mettre à jour les informations d'une équipe")
  @tags(["Équipe"])
  @path({
    id: { type: "number", required: true, description: "id de l'équipe" },
  })
  @body({
    name: { type: "string", required: false, description: "Nom de l'équipe" },
    description: {
      type: "string",
      required: false,
      description: "Description de l'équipe",
    },
  })
  @responses({
    200: { description: "Équipe mise à jour avec succès" },
    400: { description: "Données invalides fournies" },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async updateTeam(ctx) {
    const { id } = ctx.params;
    const { name, description } = ctx.request.body;
    const form = new Form();
    if (name) {
      form.stringField("name", (value) => {
        rules.required(value, "Un nom est requis");
      });
    }

    if (description !== null) {
      form.stringField("description", (value) => {
        rules.minLen(
          value,
          10,
          "La description doit avoir au moins 10 caractères"
        );
        rules.maxLen(
          value,
          255,
          "La description ne doit pas dépasser 255 caractères"
        );
      });
    }

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation", form.errors());
    }

    const team = await ctx.db.Team.findByPk(id);
    if (!team) {
      throw new HttpError(404, "Équipe non trouvée");

    }

    await team.update({ name, description });
    ctx.body = { team: team };
  }
}

module.exports = Edit.updateTeam;
