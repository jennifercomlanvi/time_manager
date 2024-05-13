import {
  request,
  summary,
  tags,
  responses,
  middlewaresAll,
} from "koa-swagger-decorator";
import HttpError from "../../lib/HttpError";
import auth from "../../middleware/auth";

class StopTimer {
  @request("put", "/api/v1/timer/stop/{id}")
  @summary("Arrête un timer existant et enregistre la durée")
  @tags(["Timer"])
  @middlewaresAll([auth])
  @responses({
    200: { description: "Timer arrêté avec succès et durée enregistrée" },
    404: { description: "Timer non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const { id } = ctx.params;

    try {
      const timer = await ctx.db.Timer.findByPk(id);
      if (!timer) {
        throw new HttpError(404, "not_found", "Timer non trouvé");
      }

      if (!timer.timer_end) {
        timer.timer_end = new Date();
        const duration = (timer.timer_end - timer.timer_start) / 1000; // Conversion de la durée en secondes
        timer.timer_duration = Math.floor(duration); // Arrondissement à la seconde la plus proche

        await timer.save();
        ctx.status = 200;
        ctx.body = {
          message: "Timer arrêté avec succès et durée enregistrée",
          timer,
        };
      } else {
        ctx.status = 409; // Conflit si le timer est déjà arrêté
        ctx.body = { message: "Le timer est déjà arrêté", timer };
      }
    } catch (error) {
      console.error("Erreur lors de l'arrêt du timer :", error);
      throw new HttpError(500, "server_error", "Erreur interne du serveur");
    }
  }
}

module.exports = StopTimer;
