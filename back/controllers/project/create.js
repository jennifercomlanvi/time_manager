const Form = require("../../lib/validation/form");
const HttpError = require("../../lib/HttpError");
const rules = require("../../lib/validation/rules");

const {
  request,
  summary,
  body,
  tags,
  responses,
  security,
} = require("koa-swagger-decorator");

class Project {
  @request("post", "/api/v1/project")
  @summary("Crée un nouveau projet")
  @tags(["Projet"])
  @body({
    team: {
      type: "integer",
      required: true,
      description: "ID de l'équipe associée au projet",
    },
    name: {
      type: "string",
      required: true,
      description: "Nom du projet",
    },
    description: {
      type: "string",
      required: false,
      description: "Description du projet",
    },
    deadline: {
      type: "string",
      required: false,
      description: "Date limite du projet (format YYYY-MM-DD)",
    },
  })
  @security([{ BearerAuth: [] }])
  @responses({
    200: { description: "Projet créé avec succès" },
    400: {
      description:
        "Données invalides ou projet déjà existant dans cette équipe",
    },
    404: { description: "Équipe non trouvée" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("name", (value) => {
      rules.required(value, "Un email valide est requis");
    });
    form.integerField("team", (value) => {
      rules.required(value, "Une équipe est requise");
    });
    form.stringField("name", (value) => {
      rules.required(value, "Un nom valide est requis");
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
    form.dateField("deadline", (value) => {
      // rules.required(value, "Un date valide est requise");
    });
    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Erreur de validation", form.errors());
    }

    // Vérifier si l'équipe existe
    const team = await ctx.db.Team.findByPk(form.value("team"));
    if (!team) {
      throw new HttpError(404, "Équipe non trouvée");
    }

    // Vérifier l'unicité du nom du projet au sein de l'équipe
    const existingProject = await ctx.db.Project.findOne({
      where: {
        project_team: form.value("team"),
        project_name: form.value("name"),
      },
    });

    if (existingProject) {
      throw new HttpError(
        400,
        "Un projet avec ce nom existe déjà dans l'équipe spécifiée."
      );
    }

    // Création du projet
    const newProject = await ctx.db.Project.create({
      project_name: form.value("name"),
      project_description: form.value("description"),
      project_deadline: form.value("deadline"),
      project_team: form.value("team"),
    });

    ctx.status = 201;
    ctx.body = {
      message: "Projet créé avec succès",
      project: {
        id: newProject.project_id,
        name: newProject.project_name,
        description: newProject.project_description,
        deadline: newProject.project_deadline,
      },
    };
  }
}

module.exports = Project.index;
