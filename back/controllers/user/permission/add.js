import {
  request,
  summary,
  tags,
  body,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import HttpError from "../../../lib/HttpError";
import Form from "../../../lib/validation/form";
import rules from "../../../lib/validation/rules";
import auth from "../../../middleware/auth";
// import permissions from "../../../middleware/permissions";

class AddPermission {
  @request("post", "/api/v1/permissions")
  @summary("Ajoute une permission à un utilisateur")
  @tags(["Permission"])
  @middlewaresAll([auth])
  @body({
    email: {
      type: "string",
      required: true,
      description: "Email de l'utilisateur",
    },
    team: { type: "number", required: true, description: "ID de l'équipe" },
    level: {
      type: "number",
      required: true,
      description: "Niveau de la permission",
    },
  })
  @responses({
    200: { description: "Permission ajoutée avec succès" },
    400: { description: "Erreur de validation ou utilisateur non trouvé" },
    404: { description: "Utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("email", (value) => {
      rules.required(value, "Un email est requis");
    });
    form.integerField("team", (value) => {
      rules.required(value, "Une équipe est requise");
    });
    form.integerField("level", (value) => {
      console.log(value);
      rules.required(value, "Un niveau est requis");
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation", form.errors());
    }

    const user = await ctx.db.User.findOne({
      where: { user_email: form.value("email") },
    });

    if (!user) {
      throw new HttpError(404, "not_exist", "Utilisateur non trouvé");
    }

    const permissionExists = await ctx.db.Permission.findOne({
      where: {
        perm_user: user.user_id,
        perm_team: form.value("team"),
      },
    });
    console.log(permissionExists);
    if (permissionExists) {
      throw new HttpError(
        400,
        "permission_exist",
        "L'utilisateur a déjà cette permission pour l'équipe spécifiée"
      );
    }

    const permission = await ctx.db.Permission.create({
      perm_user: user.user_id,
      perm_team: form.value("team"),
      perm_level: form.value("level"),
    });

    ctx.status = 201;
    ctx.body = { message: "Permission ajoutée avec succès", permission };
  }
}

module.exports = AddPermission;
