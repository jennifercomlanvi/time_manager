const Form = require("../../lib/validation/form");
const HttpError = require("../../lib/HttpError");
const rules = require("../../lib/validation/rules");
import auth from "../../middleware/auth";
const {
  request,
  summary,
  body,
  tags,
  responses,
  middlewaresAll,
} = require("koa-swagger-decorator");

class CreateTask {
  @request("post", "/api/v1/task")
  @summary("Créer une nouvelle tâche")
  @tags(["Task"])
  @middlewaresAll([auth])
  @body({
    project: {
      type: "integer",
      required: true,
      description: "ID du projet",
    },
    name: {
      type: "string",
      required: true,
      description: "Nom de la tâche",
    },
    description: {
      type: "string",
      required: false,
      description: "Description de la tâche",
    },
  })
  @responses({
    200: { description: "Tâche créé avec succès" },
    400: {
      description:
        "Données invalides ou projet déjà existant dans cette équipe",
    },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const form = new Form();
    form.integerField("project", (value) => {
      rules.required(value, "Un projet est requis");
    });
    form.stringField("name", (value) => {
      rules.required(value, "Un nom  est requis");
      rules.minLen(value, 4, "Le nom doit comporter au moins 4 caractères");
    });
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
      throw new HttpError(400, "Erreur de validation", form.errors());
    }

    // Vérifier si le projet existe
    const project = await ctx.db.Project.findByPk(form.value("project"));
    if (!project) {
      throw new HttpError(404, "Équipe non trouvée");
    }

    // Vérifier l'unicité du nom du projet au sein de l'équipe
    const existingTask = await ctx.db.Task.findOne({
      where: {
        task_project: form.value("project"),
        task_name: form.value("name"),
      },
    });

    if (existingTask) {
      throw new HttpError(
        400,
        "Une tâche avec ce nom existe déjà dans le projet."
      );
    }

    // Création de la tâche
    const newTask = await ctx.db.Task.create({
      task_name: form.value("name"),
      task_description: form.value("description"),
      task_project: form.value("project"),
      task_state: ctx.db.Task.STATES.TODO,
    });

    ctx.status = 201;
    ctx.body = {
      message: "Projet créé avec succès",
      task: {
        id: newTask.task_id,
        name: newTask.task_name,
        description: newTask.task_description,
      },
    };
  }
}

module.exports = CreateTask;
