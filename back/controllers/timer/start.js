import {
  request,
  summary,
  tags,
  body,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import HttpError from "../../lib/HttpError";
import auth from "../../middleware/auth";

class StartTimer {
  @request("post", "/api/v1/timer/start")
  @summary("Démarre un nouveau timer")
  @tags(["Timer"])
  @middlewaresAll([auth])
  @body({
    task: {
      type: "number",
      required: false,
      description: "ID de la tâche associée",
    },
    project: {
      type: "number",
      required: false,
      description: "ID du projet associé",
    },
  })
  @responses({
    200: { description: "Timer démarré avec succès" },
    400: { description: "Erreur de validation" },
    409: { description: "Timer en cours arrêté et nouveau timer démarré" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const { task, project } = ctx.request.body;
    const user = ctx.state.user.id;

    try {
      // Rechercher un timer en cours pour cet utilisateur sans heure de fin ou durée
      const existingTimer = await ctx.db.Timer.findOne({
        where: {
          timer_user: user,
          timer_end: null,
          timer_duration: null,
        },
      });

      // Si un timer en cours existe, l'arrêter
      if (existingTimer) {
        existingTimer.timer_end = new Date();
        await existingTimer.save();
      }

      // Créer un nouveau timer
      const timer = await ctx.db.Timer.create({
        timer_start: new Date(),
        timer_task: task,
        timer_project: project,
        timer_user: user,
      });

      ctx.status = existingTimer ? 409 : 200;
      ctx.body = {
        message: existingTimer
          ? "Timer en cours arrêté et nouveau timer démarré"
          : "Timer démarré avec succès",
        timer,
      };
    } catch (error) {
      throw new HttpError(500, "Erreur interne du serveur");
    }
  }
}

module.exports = StartTimer;
