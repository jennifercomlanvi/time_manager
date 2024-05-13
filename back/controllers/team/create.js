import Form from "../../lib/validation/form";
import rules from "../../lib/validation/rules";
import HttpError from "../../lib/HttpError";
import {
  request,
  summary,
  body,
  tags,
  security,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import auth from "../../middleware/auth";

class CreateTeam {
  @request("post", "/api/v1/team")
  @summary("Crée une nouvelle équipe")
  @tags(["Team"])
  @middlewaresAll([auth])
  @body({
    name: { type: "string", required: true, description: "Nom de l'équipe" },
    description: {
      type: "string",
      required: false,
      description: "Description de l'équipe",
    },
  })
  @security([{ BearerAuth: [] }])
  @responses({
    200: { description: "Équipe créée avec succès" },
    400: { description: "Erreur de validation ou l'équipe existe déjà" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("name", rules.required);
    form.stringField("description", (value) => {
      if (value) {
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
      }
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation", form.errors());
    }

    const teamExists = await ctx.db.Team.findOne({
      where: { team_name: form.value("name") },
    });
    if (teamExists) {
      throw new HttpError(400, "Cette équipe existe déjà");
    }

    const team = await ctx.db.Team.create({
      team_name: form.value("name"),
      team_description: form.value("description"),
    });

    await ctx.db.Permission.create({
      perm_user: ctx.state.user.id,
      perm_team: team.team_id,
      perm_level: ctx.db.Permission.LEVELS.ADMIN,
    });

    ctx.response.body = { team: team };
  }
}

module.exports = CreateTeam;
