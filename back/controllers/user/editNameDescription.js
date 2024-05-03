import {
  request,
  summary,
  tags,
  body,
  responses,
  path,
  security,
  middlewaresAll,
} from "koa-swagger-decorator";
import HttpError from "../../lib/HttpError";
import Form from "../../lib/validation/form";
import { minLen } from "../../lib/validation/rules";
import auth from "../../middleware/auth";

class UserEdit {
  @request("put", "/api/v1/user/{uuid}")
  @summary("Modifier le nom et la description d'un utilisateur")
  @tags(["User"])
  @middlewaresAll([auth])
  @path({
    uuid: {
      type: "string",
      required: true,
      description: "UUID de l'utilisateur",
    },
  })
  @body({
    name: {
      type: "string",
      required: false,
      description: "Nouveau nom de l'utilisateur",
    },
    description: {
      type: "string",
      required: false,
      description: "Nouvelle description de l'utilisateur",
    },
  })
  @security([{ BearerAuth: [] }])
  @responses({
    200: { description: "Utilisateur modifié avec succès" },
    400: { description: "Erreur de validation ou de données" },
    404: { description: "Utilisateur non trouvé" },
    401: { description: "Non autorisé" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("name", (value) => {
      if (value)
        minLen(value, 4, "Le nom doit comporter au moins 4 caractères");
    });
    form.stringField("description", (value) => {
      if (value)
        minLen(
          value,
          10,
          "La description doit comporter au moins 10 caractères"
        );
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Validation Error", form.errors());
    }

    const uuid = ctx.params.uuid;
    const user = await ctx.db.User.findOne({
      where: { user_uuid: uuid },
    });

    user.user_name = form.value("name") || user.user_name;
    user.user_description = form.value("description") || user.user_description;
    await user.save();

    ctx.body = {
      name: user.user_name,
      description: user.user_description,
    };
  }
}

module.exports = UserEdit;
