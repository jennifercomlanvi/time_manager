import Form from "../../lib/validation/form";
import {
  required as _required,
  minLen,
  maxLen,
} from "../../lib/validation/rules";
import HttpError from "../../lib/HttpError";
import { request, summary, body, tags, responses } from "koa-swagger-decorator";
class CreateTeam {
  @request("post", "/api/v1/team")
  @summary("Crée une nouvelle équipe")
  @tags(["Team"])
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
      _required(value, "Un nom est requis");
    });
    form.stringField("description", (value) => {
      if (value) {
        minLen(value, 10, "La description doit avoir au moins 10 caractères");
        maxLen(
          value,
          255,
          "La description ne doit pas dépasser 255 caractères"
        );
      }
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation", form.errors());
    }

    let team = await ctx.db.Team.findOne({
      where: { team_name: form.value("name") },
    });

    if (team) {
      form.setError("name", "Cette équipe existe déjà");
      throw new HttpError(400, "validation", form.errors());
    }

    team = await ctx.db.Team.create({
      team_name: form.value("name"),
      team_description: form.value("description"),
    });

    await ctx.db.Permission.create({
      perm_user: ctx.state.user.id,
      perm_team: team.team_id,
      perm_level: ctx.db.Permission.LEVELS.ADMIN,
    });

    // Envoyer une réponse réussie
    ctx.response.body = { team: team };
  }
}
// module.exports = Create.index;
module.exports = CreateTeam;
