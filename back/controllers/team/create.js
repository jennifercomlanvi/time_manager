const Form = require("../../lib/validation/form");
const rules = require("../../lib/validation/rules");
const HttpError = require("../../lib/HttpError");
const {
  request,
  summary,
  body,
  tags,
  responses,
} = require("koa-swagger-decorator");
// Fonction pour créer une équipe
class Create {
  @request("post", "/api/v1/team")
  @summary("Crée une nouvelle équipe")
  @tags(["Équipe"])
  @body({
    name: { type: "string", required: true, description: "Nom de l'équipe" },
    description: {
      type: "string",
      required: false,
      description: "Description de l'équipe",
    },
  })
  @responses({
    200: { description: "Équipe créée avec succès" },
    400: { description: "Erreur de validation ou l'équipe existe déjà" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("name", (value) => {
      rules.required(value, "Un nom est requis");
    });

    const description = form.value("description");
    if (description !== null) {
      rules.minLen(
        description,
        10,
        "La description doit avoir au moins 10 caractères"
      );
      rules.maxLen(
        description,
        255,
        "La description ne doit pas dépasser 255 caractères"
      );
    }

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation", form.errors());
    }

    let team = await ctx.db.Team.findOne({
      where: { team_name: form.value("name") },
    });

    if (team) {
      form.setError("name", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    //Création de l'équipe dans la base de données
    team = await ctx.db.Team.create({
      name: form.value("name"),
      description: description,
    });

    await ctx.db.Permission.create({
      perm_user: ctx.state.user.id,
      perm_team: team.id,
      level: ctx.db.Permission.LEVELS.ADMIN,
    });

    // Envoyer une réponse réussie
    ctx.response.body = { team: team };
  }
}
module.exports = Create.index;
