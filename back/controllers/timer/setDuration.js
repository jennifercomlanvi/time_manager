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

class SetDuration {
  @request("put", "/api/v1/timer/duration")
  @summary("Définit la durée d’un timer")
  @tags(["Timer"])
  @middlewaresAll([auth])
  @body({
    duration: {
      type: "string",
      required: true,
      description: "Durée du timer au format HH:MM:SS",
    },
  })
  @responses({
    200: { description: "Durée du timer mise à jour avec succès" },
    404: { description: "Timer non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const { id } = ctx.params;
    const { duration } = ctx.request.body;

    const timer = await ctx.db.Timer.findByPk(id);
    if (!timer) {
      throw new HttpError(404, "not_found", "Timer non trouvé");
    }

    timer.timer_duration = duration;
    await timer.save();

    ctx.status = 200;
    ctx.body = { message: "Durée du timer mise à jour avec succès", timer };
  }
}

module.exports = SetDuration;
// import {
//     request,
//     summary,
//     tags,
//     body,
//     responses,
//     middlewaresAll,
//   } from "koa-swagger-decorator";
//   import HttpError from "../../lib/HttpError";
//   import auth from "../../middleware/auth";

//   class SetDuration {
//     @request("put", "/api/v1/timers/duration/{id}")
//     @summary("Définit la durée d’un timer")
//     @tags(["Timer"])
//     @middlewaresAll([auth])
//     @body({
//       duration: {
//         type: "string",
//         required: true,
//         description: "Durée du timer au format HH:MM:SS",
//       },
//     })
//     @responses({
//       200: { description: "Durée du timer mise à jour avec succès" },
//       404: { description: "Timer non trouvé" },
//       500: { description: "Erreur interne du serveur" },
//     })
//     static async index(ctx) {
//       const { id } = ctx.params;
//       const { duration } = ctx.request.body;

//       // Conversion du format HH:MM:SS en secondes
//       const seconds = SetDuration.convertDurationToSeconds(duration);

//       const timer = await ctx.db.Timer.findByPk(id);
//       if (!timer) {
//         throw new HttpError(404, "not_found", "Timer non trouvé");
//       }

//       // Enregistrement de la durée en secondes
//       timer.timer_duration = seconds;
//       await timer.save();

//       ctx.status = 200;
//       ctx.body = { message: "Durée du timer mise à jour avec succès", timer };
//     }

//     // Convertit une chaîne HH:MM:SS en secondes
//     static convertDurationToSeconds(duration) {
//       const [hours, minutes, seconds] = duration.split(':').map(Number);
//       return hours * 3600 + minutes * 60 + seconds;
//     }
//   }

//   module.exports = SetDuration;
