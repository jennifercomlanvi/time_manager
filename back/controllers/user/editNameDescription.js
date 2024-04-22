const {
  request,
  summary,
  tags,
  body,
  responses,
  path,
  security,
} = require("koa-swagger-decorator");
const HttpError = require("../../lib/HttpError");
const Form = require("../../lib/validation/form");
const rules = require("../../lib/validation/rules");

class User {
  @request("put", "/api/v1/user/{uuid}")
  @summary("Modifier le nom et la description d'un utilisateur")
  @tags(["Utilisateur"])
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
  static async updateUser(ctx) {
    const form = new Form();
    form.stringField("name", (value) => {
      if (value)
        rules.minLen(value, 4, "Le nom doit comporter au moins 2 caractères");
    });
    form.stringField("description", (value) => {
      if (value)
        rules.minLen(
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

module.exports = User.updateUser;
